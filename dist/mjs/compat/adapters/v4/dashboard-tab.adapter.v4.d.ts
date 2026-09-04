import { DashboardTab } from '../../../models/entities/dashboard-tab.model.js';
import { EntityAdapter } from '../entity-adapter.js';
/**
 * v4 adapter for `DashboardTab`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.15 renamed `DashboardTabEntity.Id` to `EntityId`
 * *inside* the release window, so stored tab documents can carry either spelling on any 4.x
 * platform. Read both, always write `EntityId`.
 *
 * Deliberately not handled:
 * - `EntityMapping` (singular, `string -> string`), the short-lived early-4.15 field, is **not**
 *   mapped onto `EntityMappings` (`string -> DashboardTabEntity`): the structures differ and the
 *   `Type` half is unknown. It is left on the payload untouched.
 * - Writing `EntityMappings` (or `PlaceholderValues`/`PlaceholderDefinition`/`MasterTabId`) to a
 *   platform below 4.15 silently loses the data, because the server drops unknown properties.
 *   That is data loss an adapter cannot repair, so it stays behind the `entityMappings` feature
 *   flag (`lib/api/features.ts`) - apps check `supports('entityMappings')` before writing.
 */
export declare const dashboardTabAdapterV4: EntityAdapter<DashboardTab>;
