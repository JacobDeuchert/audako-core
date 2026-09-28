import { Role } from '../../../models/entities/role.model.js';
import { additionalFieldsAdapterV4, idCodec, PromotedKey } from './additional-fields.v4.js';

/** Promoted `Role` keys (v5 `RoleMigrator_V1`). */
export const ROLE_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'StartDashboard', path: ['StartDashboardId'], codec: idCodec },
];

/** v4 adapter for `Role`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const roleAdapterV4 = additionalFieldsAdapterV4<Role>(() => ROLE_PROMOTED_KEYS);
