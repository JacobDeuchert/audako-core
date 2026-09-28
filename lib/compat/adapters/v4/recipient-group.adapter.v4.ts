import { RecipientGroup } from '../../../models/entities/recipient-group.model.js';
import { additionalFieldsAdapterV4, hexColorCodec, PromotedKey } from './additional-fields.v4.js';

/**
 * Promoted `RecipientGroup` keys (v5 `RecipientGroupMigrator_V1`). `SelectedUnit` was form state;
 * v5 drops it, v4 leaves it in the map.
 */
export const RECIPIENT_GROUP_PROMOTED_KEYS: PromotedKey[] = [{ key: 'Color', path: ['Color'], codec: hexColorCodec }];

/** v4 adapter for `RecipientGroup`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const recipientGroupAdapterV4 = additionalFieldsAdapterV4<RecipientGroup>(() => RECIPIENT_GROUP_PROMOTED_KEYS);
