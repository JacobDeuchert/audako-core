import { Dashboard } from '../../../models/entities/dashboard.model.js';
import {
  additionalFieldsAdapterV4,
  ICON_MAX_LENGTH,
  idCodec,
  nullableIntCodec,
  PromotedKey,
  textCodec,
} from './additional-fields.v4.js';

/**
 * Promoted `Dashboard` keys (v5 `DashboardMigrator_V1`). `Tabs` and `StartDashboard` stay in the
 * map: their v5 targets are `DashboardTab.Order` and `Group.StartDashboardId` on other entities.
 */
export const DASHBOARD_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'Icon', path: ['Icon'], codec: textCodec(ICON_MAX_LENGTH) },
  { key: 'Order', path: ['Order'], codec: nullableIntCodec },
  { key: 'StartTab', path: ['StartTabId'], codec: idCodec },
];

/** v4 adapter for `Dashboard`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const dashboardAdapterV4 = additionalFieldsAdapterV4<Dashboard>(() => DASHBOARD_PROMOTED_KEYS);
