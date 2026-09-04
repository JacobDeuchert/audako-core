import { BatchDefinition } from '../../../models/entities/batch-definition.model.js';
import { EntityAdapter } from '../entity-adapter.js';
/**
 * v4 adapter for `BatchDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.17 added `MetadataField.Editable` and
 * `BatchDefinitionMigrator_V1` backfilled it as `ObligatoryAt == Stop` for manual fields only
 * (non-manual fields stay absent, i.e. `false`). Below 4.17 the property does not exist, so the
 * adapter derives it exactly the way the migrator does.
 */
export declare const batchDefinitionAdapterV4: EntityAdapter<BatchDefinition>;
