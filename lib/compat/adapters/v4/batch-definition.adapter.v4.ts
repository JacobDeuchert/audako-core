import { ApiVersionInfo } from '../../../api/api-version.js';
import { BatchAction, BatchDefinition, MetadataSource } from '../../../models/entities/batch-definition.model.js';
import { EntityAdapter } from '../entity-adapter.js';

/**
 * v4 adapter for `BatchDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.17 added `MetadataField.Editable` and
 * `BatchDefinitionMigrator_V1` backfilled it as `ObligatoryAt == Stop` for manual fields only
 * (non-manual fields stay absent, i.e. `false`). Below 4.17 the property does not exist, so the
 * adapter derives it exactly the way the migrator does.
 */
export const batchDefinitionAdapterV4: EntityAdapter<BatchDefinition> = {
  fromWire(wire: any, ctx: ApiVersionInfo): BatchDefinition {
    if (!wire || typeof wire !== 'object' || !ctx.isV4 || ctx.isAtLeast('4.17')) {
      return wire;
    }

    const fields = wire.MetadataFields;
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      return wire as BatchDefinition;
    }

    let changed = false;
    const metadataFields: any = {};
    for (const key of Object.keys(fields)) {
      const field = fields[key];
      if (field && typeof field === 'object' && (field.Editable === undefined || field.Editable === null)) {
        // Same rule as BatchDefinitionMigrator_V1: manual + obligatory at Stop => editable.
        metadataFields[key] = {
          ...field,
          Editable: field.Source === MetadataSource.Manual && field.ObligatoryAt === BatchAction.Stop,
        };
        changed = true;
      } else {
        metadataFields[key] = field;
      }
    }

    return (changed ? { ...wire, MetadataFields: metadataFields } : wire) as BatchDefinition;
  },

  // Nothing to do on writes: below 4.17 the server ignores the unknown `Editable` key and keeps
  // deriving the behaviour from `ObligatoryAt`, so the canonical payload is safe as-is.
  toWire(entity: any): any {
    return entity;
  },
};
