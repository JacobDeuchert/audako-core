import { Group } from '../../../models/entities/group.model.js';
import {
  additionalFieldsAdapterV4,
  ICON_MAX_LENGTH,
  nullableIntCodec,
  positionCodec,
  PromotedKey,
  textCodec,
} from './additional-fields.v4.js';

/**
 * Promoted `Group` keys (v5 `GroupMigrator_V1`). `StartDashboardId` is not mapped: on v4 the start
 * dashboard is a flag on the dashboards, see `Group.StartDashboardId`.
 */
export const GROUP_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'Position', path: ['Position'], codec: positionCodec },
  { key: 'Icon', path: ['Icon'], codec: textCodec(ICON_MAX_LENGTH) },
  { key: 'Order', path: ['Order'], codec: nullableIntCodec },
  { key: 'Picture', path: ['Picture'], codec: textCodec() },
];

/** v4 adapter for `Group`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const groupAdapterV4 = additionalFieldsAdapterV4<Group>(() => GROUP_PROMOTED_KEYS);
