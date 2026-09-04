import { EventDefinition } from '../../../models/entities/event-definition.model.js';
import { EntityAdapter } from '../entity-adapter.js';
/**
 * 4.12 `ExpressionParameters[].Type` values -> the `*Settings` names `EventDefinitionMigrator_V2`
 * wrote when 4.13 bumped `EventDefinition` to `CollectionVersion(2)`. From 4.13 on the value
 * equals the condition's `_t`, which is what `EventConditionSettingsType` models.
 * Two entries are irregular: `DataSourceFailureCondition -> ConnectionFailureConditionSettings`
 * and `DataConnectionFailureCondition -> DataConnectionFailure` (no `Settings` suffix).
 */
export declare const LEGACY_EXPRESSION_PARAMETER_TYPES: {
    [legacy: string]: string;
};
/** Reverse of {@link LEGACY_EXPRESSION_PARAMETER_TYPES}, used when writing to a 4.12 platform. */
export declare const CANONICAL_EXPRESSION_PARAMETER_TYPES: {
    [canonical: string]: string;
};
/**
 * v4 adapter for `EventDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models":
 * - 4.13 `ExpressionParameters[].Type` values rewritten by the migrator -> value map on 4.12 only.
 * - 4.17 `EventCategoryId` arrives as bare `null` instead of `{Value:null}` -> coerce below 4.17.
 */
export declare const eventDefinitionAdapterV4: EntityAdapter<EventDefinition>;
