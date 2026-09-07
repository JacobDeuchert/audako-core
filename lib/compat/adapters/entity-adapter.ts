import { ApiVersionInfo } from '../../api/api-version.js';
import { EntityType } from '../../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../../models/entity-type-class-mapping.js';

/**
 * Maps between the canonical (v5 shaped) model and what a given platform version puts on the
 * wire. Only entities that actually differ get an adapter; everything else uses
 * {@link identityAdapter}.
 *
 * Add a per-entity v4 adapter in `lib/compat/adapters/v4/` as one file per entity, e.g.
 * `event-category.adapter.v4.ts` exporting an `EntityAdapter<EventCategory>`, and list it in
 * `V4_ADAPTERS` (`lib/compat/adapters/v4/index.ts`). `baseFromWire` / `baseToWire` already run
 * around every adapter (see `applyFromWire` / `applyToWire` in `lib/compat/adapters/index.ts`),
 * so a per-entity adapter only handles its own renames and defaults.
 */
/**
 * How much of the entity the payload contains, and therefore how far the shared read pass may
 * go when filling model defaults.
 *
 * - `full`      the payload is the whole entity: absent *and* present-but-null keys are filled
 *               from the model defaults.
 * - `projected` the payload is a `$projection` result and only carries the requested keys, so
 *               only present-but-null keys are filled. Filling absent keys would fabricate data
 *               the caller never asked for (and, worse, would look like real server state).
 */
export type FromWireMode = 'full' | 'projected';

export interface EntityAdapter<T = any> {
  /**
   * Wire -> canonical model.
   *
   * @param mode `projected` when the payload is a `$projection` result. Adapters that fill a key
   *        which is *absent* from the wire (rather than present and null) must skip that fill in
   *        `projected` mode.
   */
  fromWire(wire: any, ctx: ApiVersionInfo, mode?: FromWireMode): T;
  /** Canonical model -> wire payload. */
  toWire(entity: T, ctx: ApiVersionInfo): any;
}

/**
 * True when the shared read pass and the per-entity adapters may fill `key` from a model default.
 * In `projected` mode a key that is not on the wire was simply not requested.
 */
export function canFillFromDefault(wire: any, key: string, mode: FromWireMode = 'full'): boolean {
  return mode !== 'projected' || (!!wire && typeof wire === 'object' && key in wire);
}

/** Adapter that passes payloads through unchanged. */
export const identityAdapter: EntityAdapter<any> = {
  fromWire: (wire) => wire,
  toWire: (entity) => entity,
};

/** Fields the server owns; they are never sent on a write. */
export const SERVER_OWNED_FIELDS = ['Path', 'AclAllow', 'AclDeny'];

/**
 * Identity and audit fields. They are never filled from a model default on read: a `null`
 * `CreatedOn` from the server means "unknown", and fabricating a timestamp (or an id) would
 * look like real server state.
 */
export const NEVER_FILLED_FIELDS = ['Id', 'CreatedBy', 'CreatedOn', 'ChangedBy', 'ChangedOn'];

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
 * Top-level part of {@link baseFromWire}: fills absent/null keys from `defaults` and descends into
 * nested plain settings objects (`DataSource.PermaLiveModeSettings`, `Formula.*IntervalSettings`,
 * `BatchDefinition.BatchReviewSettings`/`ReleaseSettings`, ...) where the server may return a
 * partially populated object - for example `FormulaIntervalSettings.ProvideLastValues` is `null`
 * in the earliest 4.15 builds (docs/analysis/v4-models-4.13-4.15.md).
 *
 * Not covered, by design: `_t`-discriminated sub-settings (`DataConnection.Settings`, so
 * `OpcUaSettings.TimestampSource` and the MeterBus fields) and array elements
 * (`Formula.Variables[].TagScope`). Both are `null`/empty on the default instance, so there is no
 * template to walk; they need the per-entity adapter that knows the concrete class.
 *
 * `mode` only gates the top level: once a key is present on the wire its value is the complete
 * server value, so a nested object is filled the same way in both modes (a `$projection` key
 * containing a `.` is ignored by the platform, so partial sub-objects cannot be projected).
 */
function fillDefaults(wire: any, defaults: any, mode: FromWireMode): any {
  const entity: any = { ...wire };
  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key];
    if (defaultValue === null || defaultValue === undefined || NEVER_FILLED_FIELDS.includes(key)) {
      continue;
    }

    const value = entity[key];
    if (value === null || value === undefined) {
      if (canFillFromDefault(wire, key, mode)) {
        entity[key] = cloneDefault(defaultValue);
      }
      continue;
    }

    if (isFillableSubObject(defaultValue) && isFillableSubObject(value)) {
      entity[key] = fillDefaults(value, defaultValue, 'full');
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
 *
 * @param mode `projected` for `$projection` results, where keys missing from the payload were
 *        not requested and must stay missing. Defaults to `full`.
 */
export function baseFromWire<T = any>(wire: any, entityType: EntityType, mode: FromWireMode = 'full'): T {
  if (!wire || typeof wire !== 'object' || Array.isArray(wire)) {
    return wire;
  }

  const defaults = getDefaultInstance(entityType);
  if (!defaults) {
    return wire;
  }

  const entity: any = fillDefaults(wire, defaults, mode);
  return entity as T;
}
