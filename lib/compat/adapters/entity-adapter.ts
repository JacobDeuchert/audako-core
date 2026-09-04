import { ApiVersionInfo } from '../../api/api-version.js';
import { EntityType } from '../../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../../models/entity-type-class-mapping.js';

/**
 * Maps between the canonical (v5 shaped) model and what a given platform version puts on the
 * wire. Only entities that actually differ get an adapter; everything else uses
 * {@link identityAdapter}.
 *
 * Register a per-entity v4 adapter in `lib/compat/adapters/v4/` as one file per entity, e.g.
 * `event-category.adapter.v4.ts` exporting an `EntityAdapter<EventCategory>`, and add it to
 * {@link AdapterRegistry} for the entity type. `baseFromWire` / `baseToWire` already run around
 * every adapter, so a per-entity adapter only handles its own renames and defaults.
 */
export interface EntityAdapter<T = any> {
  /** Wire -> canonical model. */
  fromWire(wire: any, ctx: ApiVersionInfo): T;
  /** Canonical model -> wire payload. */
  toWire(entity: T, ctx: ApiVersionInfo): any;
}

/** Adapter that passes payloads through unchanged. */
export const identityAdapter: EntityAdapter<any> = {
  fromWire: (wire) => wire,
  toWire: (entity) => entity,
};

/** Fields the server owns; they are never sent on a write. */
export const SERVER_OWNED_FIELDS = ['Path', 'AclAllow', 'AclDeny'];

/**
 * Shared write pass applied to every entity before its adapter runs: strips the server-owned
 * `Path`, `AclAllow` and `AclDeny`. Harmless on v4, required on v5 where they are discarded
 * anyway (docs/analysis/v4-to-v5-models.md).
 */
export function baseToWire<T>(entity: T): any {
  if (!entity || typeof entity !== 'object') {
    return entity;
  }

  const payload: any = Array.isArray(entity) ? entity.slice() : { ...(entity as any) };
  for (const field of SERVER_OWNED_FIELDS) {
    delete payload[field];
  }
  return payload;
}

const defaultInstanceCache = new Map<EntityType, any>();

/** Default instance of an entity type, as produced by its constructor. Cached per type. */
function getDefaultInstance(entityType: EntityType): any {
  if (!defaultInstanceCache.has(entityType)) {
    const entityClass = EntityTypeClassMapping[entityType];
    let instance: any = null;
    if (entityClass) {
      try {
        instance = new (entityClass as any)();
      } catch {
        instance = null;
      }
    }
    defaultInstanceCache.set(entityType, instance);
  }
  return defaultInstanceCache.get(entityType);
}

/**
 * Prototype-preserving deep copy of a default value. The default instance is cached per entity
 * type, so handing the very same sub-object to every entity read would let one caller's mutation
 * leak into the next read.
 */
function cloneDefault(value: any): any {
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map(cloneDefault);
  }

  const clone = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value)) {
    clone[key] = cloneDefault(value[key]);
  }
  return clone;
}

/**
 * True for a plain settings-style sub-object the default pass may descend into.
 *
 * `Field<T>` / `TranslatableField<T>` are excluded on purpose: a `Field` whose `Value` is `null`
 * means "no value", not "value missing", so it must never be overwritten with a model default.
 */
function isFillableSubObject(value: any): boolean {
  return (
    !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !('Value' in value)
  );
}

/**
 * Recursive part of {@link baseFromWire}: fills absent/null keys from `defaults` and descends into
 * nested plain settings objects (`DataSource.PermaLiveModeSettings`, `Formula.*IntervalSettings`,
 * `BatchDefinition.BatchReviewSettings`/`ReleaseSettings`, ...) where the server may return a
 * partially populated object - for example `FormulaIntervalSettings.ProvideLastValues` is `null`
 * in the earliest 4.15 builds (docs/analysis/v4-models-4.13-4.15.md).
 *
 * Not covered, by design: `_t`-discriminated sub-settings (`DataConnection.Settings`, so
 * `OpcUaSettings.TimestampSource` and the MeterBus fields) and array elements
 * (`Formula.Variables[].TagScope`). Both are `null`/empty on the default instance, so there is no
 * template to walk; they need the per-entity adapter that knows the concrete class.
 */
function fillDefaults(wire: any, defaults: any): any {
  const entity: any = { ...wire };
  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key];
    if (defaultValue === null || defaultValue === undefined) {
      continue;
    }

    const value = entity[key];
    if (value === null || value === undefined) {
      entity[key] = cloneDefault(defaultValue);
      continue;
    }

    if (isFillableSubObject(defaultValue) && isFillableSubObject(value)) {
      entity[key] = fillDefaults(value, defaultValue);
    }
  }
  return entity;
}

/**
 * Shared read pass applied to every entity before its adapter runs: treats a present-but-null
 * field as absent whenever the model's constructor defaults it to something non-null, for
 * top-level fields and for nested plain settings objects.
 * Both platform lines need this - v5 serializes every property (null instead of absent) and v4
 * returns null where the server has no stored default
 * (docs/analysis/v4-to-v5-models.md, "Server-side defaults").
 */
export function baseFromWire<T = any>(wire: any, entityType: EntityType): T {
  if (!wire || typeof wire !== 'object' || Array.isArray(wire)) {
    return wire;
  }

  const defaults = getDefaultInstance(entityType);
  if (!defaults) {
    return wire;
  }

  const entity: any = fillDefaults(wire, defaults);
  return entity as T;
}

/**
 * Entity type -> adapter lookup. Unregistered types resolve to {@link identityAdapter}.
 * `apply*` run the shared base pass around the per-entity adapter, which is what the http
 * services should call.
 */
export class AdapterRegistry {
  private _adapters = new Map<EntityType, EntityAdapter<any>>();

  /** Registers (or replaces) the adapter for an entity type. */
  public register<T>(entityType: EntityType, adapter: EntityAdapter<T>): this {
    this._adapters.set(entityType, adapter);
    return this;
  }

  /** Removes a registration, so the type falls back to the identity adapter. */
  public unregister(entityType: EntityType): this {
    this._adapters.delete(entityType);
    return this;
  }

  /** True when a per-entity adapter is registered for the type. */
  public has(entityType: EntityType): boolean {
    return this._adapters.has(entityType);
  }

  /** Adapter for the type, or {@link identityAdapter} when none is registered. */
  public getAdapter<T = any>(entityType: EntityType): EntityAdapter<T> {
    return this._adapters.get(entityType) || identityAdapter;
  }

  /** `baseFromWire` followed by the per-entity adapter. */
  public applyFromWire<T = any>(entityType: EntityType, wire: any, ctx: ApiVersionInfo): T {
    const prepared = baseFromWire(wire, entityType);
    return this.getAdapter<T>(entityType).fromWire(prepared, ctx);
  }

  /** The per-entity adapter followed by `baseToWire`. */
  public applyToWire<T = any>(entityType: EntityType, entity: T, ctx: ApiVersionInfo): any {
    const adapted = this.getAdapter<T>(entityType).toWire(entity, ctx);
    return baseToWire(adapted);
  }
}

/** Registry used by the http services. v4 adapters register themselves here. */
export const entityAdapters = new AdapterRegistry();
