import { ApiVersionInfo } from '../../api/api-version.js';
import { EntityType } from '../../models/entities/configuration-entity.model.js';
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
export declare const identityAdapter: EntityAdapter<any>;
/** Fields the server owns; they are never sent on a write. */
export declare const SERVER_OWNED_FIELDS: string[];
/**
 * Shared write pass applied to every entity before its adapter runs: strips the server-owned
 * `Path`, `AclAllow` and `AclDeny`. Harmless on v4, required on v5 where they are discarded
 * anyway (docs/analysis/v4-to-v5-models.md).
 */
export declare function baseToWire<T>(entity: T): any;
/**
 * Shared read pass applied to every entity before its adapter runs: treats a present-but-null
 * field as absent whenever the model's constructor defaults it to something non-null, for
 * top-level fields and for nested plain settings objects.
 * Both platform lines need this - v5 serializes every property (null instead of absent) and v4
 * returns null where the server has no stored default
 * (docs/analysis/v4-to-v5-models.md, "Server-side defaults").
 */
export declare function baseFromWire<T = any>(wire: any, entityType: EntityType): T;
/**
 * Entity type -> adapter lookup. Unregistered types resolve to {@link identityAdapter}.
 * `apply*` run the shared base pass around the per-entity adapter, which is what the http
 * services should call.
 */
export declare class AdapterRegistry {
    private _adapters;
    /** Registers (or replaces) the adapter for an entity type. */
    register<T>(entityType: EntityType, adapter: EntityAdapter<T>): this;
    /** Removes a registration, so the type falls back to the identity adapter. */
    unregister(entityType: EntityType): this;
    /** True when a per-entity adapter is registered for the type. */
    has(entityType: EntityType): boolean;
    /** Adapter for the type, or {@link identityAdapter} when none is registered. */
    getAdapter<T = any>(entityType: EntityType): EntityAdapter<T>;
    /** `baseFromWire` followed by the per-entity adapter. */
    applyFromWire<T = any>(entityType: EntityType, wire: any, ctx: ApiVersionInfo): T;
    /** The per-entity adapter followed by `baseToWire`. */
    applyToWire<T = any>(entityType: EntityType, entity: T, ctx: ApiVersionInfo): any;
}
/** Registry used by the http services. v4 adapters register themselves here. */
export declare const entityAdapters: AdapterRegistry;
