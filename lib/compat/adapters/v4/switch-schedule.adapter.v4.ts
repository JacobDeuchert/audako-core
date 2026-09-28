import { SwitchSchedule } from '../../../models/entities/switch-schedule.model.js';
import { additionalFieldsAdapterV4, ICON_MAX_LENGTH, PromotedKey, textCodec } from './additional-fields.v4.js';

/** Promoted `SwitchSchedule` keys (v5 `SwitchScheduleMigrator_V1`). */
export const SWITCH_SCHEDULE_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'Icon', path: ['Icon'], codec: textCodec(ICON_MAX_LENGTH) },
];

/** v4 adapter for `SwitchSchedule`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const switchScheduleAdapterV4 = additionalFieldsAdapterV4<SwitchSchedule>(() => SWITCH_SCHEDULE_PROMOTED_KEYS);
