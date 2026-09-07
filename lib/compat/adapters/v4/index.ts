import { EntityType } from '../../../models/entities/configuration-entity.model.js';
import { EntityAdapter } from '../entity-adapter.js';
import { batchDefinitionAdapterV4 } from './batch-definition.adapter.v4.js';
import { dashboardTabAdapterV4 } from './dashboard-tab.adapter.v4.js';
import { eventCategoryAdapterV4 } from './event-category.adapter.v4.js';
import { eventDefinitionAdapterV4 } from './event-definition.adapter.v4.js';
import { runtimeScriptAdapterV4 } from './runtime-script.adapter.v4.js';

export * from './batch-definition.adapter.v4.js';
export * from './dashboard-tab.adapter.v4.js';
export * from './event-category.adapter.v4.js';
export * from './event-definition.adapter.v4.js';
export * from './runtime-script.adapter.v4.js';

/**
 * The v4 entity adapters, keyed by entity type. Read-only: the map is frozen and there is no
 * registration step, so bundlers may treat this module as side-effect free.
 *
 * The adapters branch on the exact platform version themselves and are identity on v5, so one
 * process-wide map serves every connection.
 */
export const V4_ADAPTERS: Readonly<Partial<Record<EntityType, EntityAdapter<any>>>> = Object.freeze({
  [EntityType.BatchDefinition]: batchDefinitionAdapterV4,
  [EntityType.DashboardTab]: dashboardTabAdapterV4,
  [EntityType.EventCategory]: eventCategoryAdapterV4,
  [EntityType.EventDefinition]: eventDefinitionAdapterV4,
  [EntityType.RuntimeScript]: runtimeScriptAdapterV4,
});

/**
 * Entity types that have a v4 adapter. Everything else uses the identity adapter, either because
 * the wire shape is unchanged across 4.12 - 5.x or because the difference is data loss that a
 * feature flag has to gate instead:
 *
 * - `TranslatableField.Translations` (< 4.16, feature `translations`): pre-4.16 servers never
 *   emitted `Translations` and drop it on write, so translations are *unsupported*, not empty.
 *   No adapter, and `Translations` is deliberately **not** stripped on writes below 4.16 - the
 *   server ignores the unknown key, the write does not fail, and stripping it would only hide
 *   from the caller that the data went nowhere.
 * - `DashboardTab.EntityMappings` (< 4.15, feature `entityMappings`): see the adapter comment.
 */
export const V4_ADAPTED_ENTITY_TYPES: EntityType[] = Object.keys(V4_ADAPTERS) as EntityType[];
