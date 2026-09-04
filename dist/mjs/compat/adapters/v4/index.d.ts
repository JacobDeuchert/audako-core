import { EntityType } from '../../../models/entities/configuration-entity.model.js';
import { AdapterRegistry } from '../entity-adapter.js';
export * from './batch-definition.adapter.v4.js';
export * from './dashboard-tab.adapter.v4.js';
export * from './event-category.adapter.v4.js';
export * from './event-definition.adapter.v4.js';
export * from './runtime-script.adapter.v4.js';
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
export declare const V4_ADAPTED_ENTITY_TYPES: EntityType[];
/**
 * Registers every v4 entity adapter. Called once at module load from
 * `lib/compat/adapters/index.ts`; pass a registry explicitly in tests.
 *
 * The adapters branch on the exact platform version themselves and are identity on v5, so
 * registering them unconditionally is safe - there is no per-connection registry.
 */
export declare function registerV4Adapters(registry?: AdapterRegistry): AdapterRegistry;
