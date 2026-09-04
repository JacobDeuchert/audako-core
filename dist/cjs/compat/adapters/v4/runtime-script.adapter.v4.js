"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeScriptAdapterV4 = void 0;
const configuration_entity_model_js_1 = require("../../../models/entities/configuration-entity.model.js");
/**
 * v4 adapter for `RuntimeScript`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.13 added `Enabled`, and documents written before it
 * have no `Enabled` at all, which the server deserializes as `{Value:false}` - i.e. every existing
 * script reads as disabled. Treat undefined/null as `true` on reads below 4.13.
 */
exports.runtimeScriptAdapterV4 = {
    fromWire(wire, ctx) {
        if (!wire || typeof wire !== 'object' || !ctx.isV4) {
            return wire;
        }
        // Below 4.13 `Enabled` does not exist on the wire; the canonical default is `true`.
        if (!ctx.isAtLeast('4.13') && (wire.Enabled === null || wire.Enabled === undefined)) {
            return Object.assign(Object.assign({}, wire), { Enabled: new configuration_entity_model_js_1.Field(true) });
        }
        return wire;
    },
    // Nothing to do on writes: a pre-4.13 platform binds the payload to its own typed model and
    // simply ignores the unknown `Enabled` key, so sending it is lossless in both directions.
    toWire(entity) {
        return entity;
    },
};
