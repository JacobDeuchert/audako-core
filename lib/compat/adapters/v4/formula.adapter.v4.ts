import { Formula } from '../../../models/entities/formula.model.js';
import { additionalFieldsAdapterV4, boolCodec, PromotedKey } from './additional-fields.v4.js';

/** Promoted `Formula` keys (v5 `FormulaMigrator_V1`). */
export const FORMULA_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'Global', path: ['SameFormulaForAllIntervals'], codec: boolCodec },
];

/** v4 adapter for `Formula`: typed properties <-> `AdditionalFields`. Identity on v5. */
export const formulaAdapterV4 = additionalFieldsAdapterV4<Formula>(() => FORMULA_PROMOTED_KEYS);
