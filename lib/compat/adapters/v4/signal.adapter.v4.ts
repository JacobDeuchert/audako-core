import { ApiVersionInfo } from '../../../api/api-version.js';
import { Field } from '../../../models/entities/configuration-entity.model.js';
import { Signal } from '../../../models/entities/signal.model.js';
import { canFillFromDefault, EntityAdapter, FromWireMode } from '../entity-adapter.js';
import {
  boolCodec,
  demoteAdditionalFields,
  hexColorCodec,
  promoteAdditionalFields,
  PromotedKey,
  scalingCalculatorStateCodec,
} from './additional-fields.v4.js';

const COUNTER_SETTINGS = 'SignalCounterSettings';
const ANALOG_SETTINGS = 'SignalAnalogSettings';

const SIGNAL_KEYS: PromotedKey[] = [
  { key: 'Color', path: ['Color'], codec: hexColorCodec },
  { key: 'MultiLine', path: ['MultiLineAddress'], codec: boolCodec },
];

const COUNTER_CHECKED: PromotedKey = {
  key: 'CounterChecked',
  path: ['Settings', 'EnforceMonotonicInput'],
  codec: boolCodec,
};

const SCALING_CALCULATOR_STATE: PromotedKey = {
  key: 'ScalingCalculatorFormState',
  path: ['Settings', 'ScalingCalculatorState'],
  codec: scalingCalculatorStateCodec,
};

function settingsType(entity: any): string | undefined {
  return entity.Settings && typeof entity.Settings === 'object' ? entity.Settings._t : undefined;
}

/**
 * Promoted `Signal` keys (v5 `SignalMigrator_V1`). The settings keys only apply to the settings
 * type that carries the property; on any other type they stay in the map.
 */
export function signalPromotedKeys(entity: any): PromotedKey[] {
  switch (settingsType(entity)) {
    case COUNTER_SETTINGS:
      return [...SIGNAL_KEYS, COUNTER_CHECKED];
    case ANALOG_SETTINGS:
      return [...SIGNAL_KEYS, SCALING_CALCULATOR_STATE];
    default:
      return SIGNAL_KEYS;
  }
}

/**
 * v4 adapter for `Signal`: typed properties <-> `AdditionalFields`. Identity on v5.
 *
 * `CounterChecked` absent on a counter means monotonic input, as after the v5 migration and as in
 * the UI's create form; only an explicit `"false"` turns it off. Writes to a counter therefore
 * always carry an explicit `"true"` or `"false"`.
 *
 * `Selectable` / `PreSelected` (blueprint selection, dropped by v5) are not mapped.
 */
export const signalAdapterV4: EntityAdapter<Signal> = {
  fromWire(wire: any, ctx: ApiVersionInfo, mode?: FromWireMode): Signal {
    if (!wire || typeof wire !== 'object' || !ctx.isV4) {
      return wire;
    }

    let entity = promoteAdditionalFields(wire, signalPromotedKeys(wire));

    const settings = entity.Settings;
    if (
      settingsType(entity) === COUNTER_SETTINGS &&
      (settings.EnforceMonotonicInput === null || settings.EnforceMonotonicInput === undefined) &&
      canFillFromDefault(wire, 'Settings', mode)
    ) {
      entity = { ...entity, Settings: { ...settings, EnforceMonotonicInput: new Field<boolean>(true) } };
    }

    return entity as Signal;
  },

  toWire(entity: any, ctx: ApiVersionInfo): any {
    if (!entity || typeof entity !== 'object' || !ctx.isV4) {
      return entity;
    }
    return demoteAdditionalFields(entity, signalPromotedKeys(entity));
  },
};
