"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDefinitionAdapterV4 = void 0;
const batch_definition_model_js_1 = require("../../../models/entities/batch-definition.model.js");
/**
 * v4 adapter for `BatchDefinition`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.17 added `MetadataField.Editable` and
 * `BatchDefinitionMigrator_V1` backfilled it as `ObligatoryAt == Stop` for manual fields only
 * (non-manual fields stay absent, i.e. `false`). Below 4.17 the property does not exist, so the
 * adapter derives it exactly the way the migrator does.
 */
exports.batchDefinitionAdapterV4 = {
    fromWire(wire, ctx) {
        if (!wire || typeof wire !== 'object' || !ctx.isV4 || ctx.isAtLeast('4.17')) {
            return wire;
        }
        const fields = wire.MetadataFields;
        if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
            return wire;
        }
        let changed = false;
        const metadataFields = {};
        for (const key of Object.keys(fields)) {
            const field = fields[key];
            if (field && typeof field === 'object' && (field.Editable === undefined || field.Editable === null)) {
                // Same rule as BatchDefinitionMigrator_V1: manual + obligatory at Stop => editable.
                metadataFields[key] = Object.assign(Object.assign({}, field), { Editable: field.Source === batch_definition_model_js_1.MetadataSource.Manual && field.ObligatoryAt === batch_definition_model_js_1.BatchAction.Stop });
                changed = true;
            }
            else {
                metadataFields[key] = field;
            }
        }
        return (changed ? Object.assign(Object.assign({}, wire), { MetadataFields: metadataFields }) : wire);
    },
    // Nothing to do on writes: below 4.17 the server ignores the unknown `Editable` key and keeps
    // deriving the behaviour from `ObligatoryAt`, so the canonical payload is safe as-is.
    toWire(entity) {
        return entity;
    },
};
