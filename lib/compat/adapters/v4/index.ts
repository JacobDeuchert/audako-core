import { EntityType } from '../../../models/entities/configuration-entity.model.js';
import { EntityAdapter } from '../entity-adapter.js';
import { batchDefinitionAdapterV4 } from './batch-definition.adapter.v4.js';
import { dashboardAdapterV4 } from './dashboard.adapter.v4.js';
import { dashboardTabAdapterV4 } from './dashboard-tab.adapter.v4.js';
import { eventCategoryAdapterV4 } from './event-category.adapter.v4.js';
import { eventDefinitionAdapterV4 } from './event-definition.adapter.v4.js';
import { formulaAdapterV4 } from './formula.adapter.v4.js';
import { groupAdapterV4 } from './group.adapter.v4.js';
import { recipientGroupAdapterV4 } from './recipient-group.adapter.v4.js';
import { roleAdapterV4 } from './role.adapter.v4.js';
import { runtimeScriptAdapterV4 } from './runtime-script.adapter.v4.js';
import { signalAdapterV4 } from './signal.adapter.v4.js';
import { switchScheduleAdapterV4 } from './switch-schedule.adapter.v4.js';

export * from './additional-fields.v4.js';
export * from './batch-definition.adapter.v4.js';
export * from './dashboard.adapter.v4.js';
export * from './dashboard-tab.adapter.v4.js';
export * from './event-category.adapter.v4.js';
export * from './event-definition.adapter.v4.js';
export * from './formula.adapter.v4.js';
export * from './group.adapter.v4.js';
export * from './recipient-group.adapter.v4.js';
export * from './role.adapter.v4.js';
export * from './runtime-script.adapter.v4.js';
export * from './signal.adapter.v4.js';
export * from './switch-schedule.adapter.v4.js';

/**
 * The v4 entity adapters, keyed by entity type. Read-only: the map is frozen and there is no
 * registration step, so bundlers may treat this module as side-effect free.
 *
 * The adapters branch on the exact platform version themselves and are identity on v5, so one
 * process-wide map serves every connection.
 */
export const V4_ADAPTERS: Readonly<Partial<Record<EntityType, EntityAdapter<any>>>> = Object.freeze({
  [EntityType.BatchDefinition]: batchDefinitionAdapterV4,
  [EntityType.Dashboard]: dashboardAdapterV4,
  [EntityType.DashboardTab]: dashboardTabAdapterV4,
  [EntityType.EventCategory]: eventCategoryAdapterV4,
  [EntityType.EventDefinition]: eventDefinitionAdapterV4,
  [EntityType.Formula]: formulaAdapterV4,
  [EntityType.Group]: groupAdapterV4,
  [EntityType.RecipientGroup]: recipientGroupAdapterV4,
  [EntityType.Role]: roleAdapterV4,
  [EntityType.RuntimeScript]: runtimeScriptAdapterV4,
  [EntityType.Signal]: signalAdapterV4,
  [EntityType.SwitchSchedule]: switchScheduleAdapterV4,
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
 * - `DashboardTab.Order`, `Group.StartDashboardId`, `ConfigurationEntity.ManagedBy` (v5 only,
 *   features `dashboardTabOrder`, `entryPointStartDashboard`, `managedBy`): the v4 data lives on
 *   other entities (`Dashboard.AdditionalFields.Tabs` / `StartDashboard`) or is not recorded.
 * - `SwitchOperation.Color`: no `EntityType`, so switch operations never pass the entity service.
 *
 * `Synchronized` -> `SynchronizedFrom` applies to every type and runs as a shared v4 pass in
 * `applyFromWire` / `applyToWire`, not as an adapter.
 */
export const V4_ADAPTED_ENTITY_TYPES: EntityType[] = Object.keys(V4_ADAPTERS) as EntityType[];
