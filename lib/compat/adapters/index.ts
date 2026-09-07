import { ApiVersionInfo } from '../../api/api-version.js';
import { EntityType } from '../../models/entities/configuration-entity.model.js';
import { baseFromWire, baseToWire, EntityAdapter, FromWireMode, identityAdapter } from './entity-adapter.js';
import { V4_ADAPTERS } from './v4/index.js';

export * from './entity-adapter.js';
export * from './v4/index.js';

/**
 * Every per-entity adapter audako-core knows, keyed by entity type. Currently only the v4
 * adapters; a v5-vs-v6 adapter would be merged in here. Unlisted types are identity.
 */
export const ENTITY_ADAPTERS: Readonly<Partial<Record<EntityType, EntityAdapter<any>>>> = Object.freeze({
  ...V4_ADAPTERS,
});

/** Adapter for the type, or {@link identityAdapter} when none is listed. */
export function getEntityAdapter<T = any>(entityType: EntityType): EntityAdapter<T> {
  return ENTITY_ADAPTERS[entityType] || identityAdapter;
}

/**
 * Wire -> canonical model: `baseFromWire` followed by the per-entity adapter.
 *
 * @param mode `projected` for `$projection` results; see {@link FromWireMode}.
 */
export function applyFromWire<T = any>(
  entityType: EntityType,
  wire: any,
  ctx: ApiVersionInfo,
  mode: FromWireMode = 'full',
): T {
  const prepared = baseFromWire(wire, entityType, mode);
  return getEntityAdapter<T>(entityType).fromWire(prepared, ctx, mode);
}

/** Canonical model -> wire payload: the per-entity adapter followed by `baseToWire`. */
export function applyToWire<T = any>(entityType: EntityType, entity: T, ctx: ApiVersionInfo): any {
  const adapted = getEntityAdapter<T>(entityType).toWire(entity, ctx);
  return baseToWire(adapted);
}
