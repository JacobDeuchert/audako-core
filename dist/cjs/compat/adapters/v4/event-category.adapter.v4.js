"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventCategoryAdapterV4 = void 0;
/**
 * v4 adapter for `EventCategory`.
 *
 * Two rules meet on the same wire key, so they are stated together:
 * - Plan, "v4 window": 4.23 renamed `Acknowledgment` to `RequiresAcknowledgment` with **no**
 *   server migrator. On 4.12 - 4.22 the wire key `Acknowledgment` therefore *is*
 *   `RequiresAcknowledgment`; read either spelling and write the legacy name below 4.23.
 * - Plan, "4.23 -> 5.0": v5 re-adds `Acknowledgment: Field<bool>` next to
 *   `RequiresAcknowledgment` with a different meaning. That field only exists on v5, so on v4 it
 *   is never read into the canonical model and never written - otherwise its value would silently
 *   become `RequiresAcknowledgment` on an older platform.
 *
 * Consequence: `Acknowledgment` is the legacy alias on v4 and a distinct field on v5. The adapter
 * only ever touches it on v4; v5 is identity.
 */
exports.eventCategoryAdapterV4 = {
    fromWire(wire, ctx) {
        if (!wire || typeof wire !== 'object' || !ctx.isV4) {
            return wire;
        }
        if (!('Acknowledgment' in wire)) {
            return wire;
        }
        const { Acknowledgment } = wire, entity = __rest(wire, ["Acknowledgment"]);
        // Below 4.23 the legacy key is authoritative and wins over anything `baseFromWire` filled in
        // from the model default (`RequiresAcknowledgment = true`), which would otherwise mask it.
        if (!ctx.isAtLeast('4.23') && Acknowledgment !== null && Acknowledgment !== undefined) {
            return Object.assign(Object.assign({}, entity), { RequiresAcknowledgment: Acknowledgment });
        }
        // 4.23+: `RequiresAcknowledgment` is the wire name. A leftover stored `Acknowledgment` can
        // still ride along on v4 query rows; drop it, it is not the v5 field.
        return entity;
    },
    toWire(entity, ctx) {
        if (!entity || typeof entity !== 'object' || !ctx.isV4) {
            return entity;
        }
        // Strip the v5-only field in every case (see the class comment).
        const { Acknowledgment } = entity, payload = __rest(entity, ["Acknowledgment"]);
        if (ctx.isAtLeast('4.23')) {
            return payload;
        }
        // Below 4.23: write the legacy name. `RequiresAcknowledgment` is kept alongside it because the
        // release attribution of the rename is fuzzy by about one release
        // (docs/analysis/v4-models-4.22-4.23.md, attribution caveat) and both platforms bind the
        // payload to their typed model, ignoring the key they do not know.
        if ('RequiresAcknowledgment' in payload) {
            return Object.assign(Object.assign({}, payload), { Acknowledgment: payload.RequiresAcknowledgment });
        }
        return payload;
    },
};
