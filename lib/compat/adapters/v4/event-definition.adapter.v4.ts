import { ApiVersionInfo } from '../../../api/api-version.js';
import { Field } from '../../../models/entities/configuration-entity.model.js';
import { EventDefinition } from '../../../models/entities/event-definition.model.js';
import { canFillFromDefault, EntityAdapter, FromWireMode } from '../entity-adapter.js';
import {
  BLOCKLY_XML_MAX_LENGTH,
  demoteAdditionalFields,
  promoteAdditionalFields,
  PromotedKey,
  textCodec,
} from './additional-fields.v4.js';

/** Promoted `EventDefinition` keys (v5 `EventDefinitionMigrator_V3`). */
export const EVENT_DEFINITION_PROMOTED_KEYS: PromotedKey[] = [
  { key: 'BlocklyXML', path: ['BlocklyXml'], codec: textCodec(BLOCKLY_XML_MAX_LENGTH) },
];

/**
 * 4.12 `ExpressionParameters[].Type` values -> the `*Settings` names `EventDefinitionMigrator_V2`
 * wrote when 4.13 bumped `EventDefinition` to `CollectionVersion(2)`. From 4.13 on the value
 * equals the condition's `_t`, which is what `EventConditionSettingsType` models.
 * Two entries are irregular: `DataSourceFailureCondition -> ConnectionFailureConditionSettings`
 * and `DataConnectionFailureCondition -> DataConnectionFailure` (no `Settings` suffix).
 */
export const LEGACY_EXPRESSION_PARAMETER_TYPES: { [legacy: string]: string } = {
  SignalCondition: 'SignalConditionSettings',
  CounterCondition: 'CounterConditionSettings',
  DataSourceFailureCondition: 'ConnectionFailureConditionSettings',
  DataConnectionFailureCondition: 'DataConnectionFailure',
  RecordingFailureCondition: 'RecordingFailureMonitoringSettings',
  ChangeRateMonitoring: 'ChangeRateMonitoringSettings',
  MaximumMonitoring: 'MaximumMonitoringSettings',
  MinimumMonitoring: 'MinimumMonitoringSettings',
  PeriodMaximumMonitoring: 'PeriodMaximumMonitoringSettings',
  PlausibilityMonitoring: 'PlausibilityMonitoringSettings',
  PositionMonitoring: 'PositionMonitoringSettings',
  DifferenceMonitoring: 'DifferenceMonitoringSettings',
  TimebasedCondition: 'TimebasedConditionSettings',
};

/** Reverse of {@link LEGACY_EXPRESSION_PARAMETER_TYPES}, used when writing to a 4.12 platform. */
export const CANONICAL_EXPRESSION_PARAMETER_TYPES: { [canonical: string]: string } = Object.keys(
  LEGACY_EXPRESSION_PARAMETER_TYPES,
).reduce((map: { [canonical: string]: string }, legacy) => {
  map[LEGACY_EXPRESSION_PARAMETER_TYPES[legacy]] = legacy;
  return map;
}, {});

/** Rewrites `ExpressionParameters[].Type.Value` through `map`, without mutating the input. */
function mapExpressionParameterTypes(entity: any, map: { [from: string]: string }): any {
  if (!Array.isArray(entity.ExpressionParameters)) {
    return entity;
  }

  let changed = false;
  const parameters = entity.ExpressionParameters.map((parameter: any) => {
    const value = parameter && parameter.Type ? parameter.Type.Value : undefined;
    const mapped = typeof value === 'string' ? map[value] : undefined;
    if (!mapped) {
      return parameter;
    }
    changed = true;
    return { ...parameter, Type: { ...parameter.Type, Value: mapped } };
  });

  return changed ? { ...entity, ExpressionParameters: parameters } : entity;
}

/**
 * v4 adapter for `EventDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models":
 * - 4.13 `ExpressionParameters[].Type` values rewritten by the migrator -> value map on 4.12 only.
 * - 4.17 `EventCategoryId` arrives as bare `null` instead of `{Value:null}` -> coerce below 4.17.
 * - every 4.x: `BlocklyXml` lives in `AdditionalFields`, see {@link EVENT_DEFINITION_PROMOTED_KEYS}.
 */
export const eventDefinitionAdapterV4: EntityAdapter<EventDefinition> = {
  fromWire(wire: any, ctx: ApiVersionInfo, mode?: FromWireMode): EventDefinition {
    if (!wire || typeof wire !== 'object' || !ctx.isV4) {
      return wire;
    }

    let entity: any = promoteAdditionalFields(wire, EVENT_DEFINITION_PROMOTED_KEYS);

    // Below 4.17 the server sends `EventCategoryId: null`; apps dereference `.Value`.
    // (`baseFromWire` covers this too, but the adapter must be correct on its own.) A key that is
    // absent on a projected read was not requested, so it is left absent.
    if (
      !ctx.isAtLeast('4.17') &&
      (entity.EventCategoryId === null || entity.EventCategoryId === undefined) &&
      canFillFromDefault(wire, 'EventCategoryId', mode)
    ) {
      entity = { ...entity, EventCategoryId: new Field<string>() };
    }

    // On 4.12 the migrator has not run, so `Type` still carries the pre-4.13 short names.
    if (!ctx.isAtLeast('4.13')) {
      entity = mapExpressionParameterTypes(entity, LEGACY_EXPRESSION_PARAMETER_TYPES);
    }

    return entity as EventDefinition;
  },

  toWire(entity: any, ctx: ApiVersionInfo): any {
    if (!entity || typeof entity !== 'object' || !ctx.isV4) {
      return entity;
    }

    const payload = demoteAdditionalFields(entity, EVENT_DEFINITION_PROMOTED_KEYS);

    // Write the pre-4.13 short names back, so a 4.12 platform keeps values it understands.
    if (!ctx.isAtLeast('4.13')) {
      return mapExpressionParameterTypes(payload, CANONICAL_EXPRESSION_PARAMETER_TYPES);
    }

    return payload;
  },
};
