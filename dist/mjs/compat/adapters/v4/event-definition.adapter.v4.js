import { Field } from '../../../models/entities/configuration-entity.model.js';
import { canFillFromDefault } from '../entity-adapter.js';
/**
 * 4.12 `ExpressionParameters[].Type` values -> the `*Settings` names `EventDefinitionMigrator_V2`
 * wrote when 4.13 bumped `EventDefinition` to `CollectionVersion(2)`. From 4.13 on the value
 * equals the condition's `_t`, which is what `EventConditionSettingsType` models.
 * Two entries are irregular: `DataSourceFailureCondition -> ConnectionFailureConditionSettings`
 * and `DataConnectionFailureCondition -> DataConnectionFailure` (no `Settings` suffix).
 */
export const LEGACY_EXPRESSION_PARAMETER_TYPES = {
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
export const CANONICAL_EXPRESSION_PARAMETER_TYPES = Object.keys(LEGACY_EXPRESSION_PARAMETER_TYPES).reduce((map, legacy) => {
    map[LEGACY_EXPRESSION_PARAMETER_TYPES[legacy]] = legacy;
    return map;
}, {});
/** Rewrites `ExpressionParameters[].Type.Value` through `map`, without mutating the input. */
function mapExpressionParameterTypes(entity, map) {
    if (!Array.isArray(entity.ExpressionParameters)) {
        return entity;
    }
    let changed = false;
    const parameters = entity.ExpressionParameters.map((parameter) => {
        const value = parameter && parameter.Type ? parameter.Type.Value : undefined;
        const mapped = typeof value === 'string' ? map[value] : undefined;
        if (!mapped) {
            return parameter;
        }
        changed = true;
        return Object.assign(Object.assign({}, parameter), { Type: Object.assign(Object.assign({}, parameter.Type), { Value: mapped }) });
    });
    return changed ? Object.assign(Object.assign({}, entity), { ExpressionParameters: parameters }) : entity;
}
/**
 * v4 adapter for `EventDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models":
 * - 4.13 `ExpressionParameters[].Type` values rewritten by the migrator -> value map on 4.12 only.
 * - 4.17 `EventCategoryId` arrives as bare `null` instead of `{Value:null}` -> coerce below 4.17.
 */
export const eventDefinitionAdapterV4 = {
    fromWire(wire, ctx, mode) {
        if (!wire || typeof wire !== 'object' || !ctx.isV4) {
            return wire;
        }
        let entity = wire;
        // Below 4.17 the server sends `EventCategoryId: null`; apps dereference `.Value`.
        // (`baseFromWire` covers this too, but the adapter must be correct on its own.) A key that is
        // absent on a projected read was not requested, so it is left absent.
        if (!ctx.isAtLeast('4.17') &&
            (entity.EventCategoryId === null || entity.EventCategoryId === undefined) &&
            canFillFromDefault(wire, 'EventCategoryId', mode)) {
            entity = Object.assign(Object.assign({}, entity), { EventCategoryId: new Field() });
        }
        // On 4.12 the migrator has not run, so `Type` still carries the pre-4.13 short names.
        if (!ctx.isAtLeast('4.13')) {
            entity = mapExpressionParameterTypes(entity, LEGACY_EXPRESSION_PARAMETER_TYPES);
        }
        return entity;
    },
    toWire(entity, ctx) {
        if (!entity || typeof entity !== 'object' || !ctx.isV4) {
            return entity;
        }
        // Write the pre-4.13 short names back, so a 4.12 platform keeps values it understands.
        if (!ctx.isAtLeast('4.13')) {
            return mapExpressionParameterTypes(entity, CANONICAL_EXPRESSION_PARAMETER_TYPES);
        }
        return entity;
    },
};
