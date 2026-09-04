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
exports.dashboardTabAdapterV4 = void 0;
/**
 * Normalizes one `EntityMappings` dictionary: `DashboardTabEntity.Id` is the pre-rename spelling
 * of `EntityId`. Returns the same object when nothing needed changing.
 */
function normalizeEntityMappings(mappings) {
    if (!mappings || typeof mappings !== 'object' || Array.isArray(mappings)) {
        return mappings;
    }
    let changed = false;
    const normalized = {};
    for (const key of Object.keys(mappings)) {
        const mapping = mappings[key];
        if (mapping && typeof mapping === 'object' && 'Id' in mapping) {
            const { Id } = mapping, rest = __rest(mapping, ["Id"]);
            normalized[key] = Object.assign(Object.assign({}, rest), { EntityId: rest.EntityId === undefined || rest.EntityId === null ? Id : rest.EntityId });
            changed = true;
        }
        else {
            normalized[key] = mapping;
        }
    }
    return changed ? normalized : mappings;
}
/** Applies {@link normalizeEntityMappings} inside the `EntityMappings` field wrapper. */
function normalizeEntityMappingsField(entity) {
    const field = entity.EntityMappings;
    if (!field || typeof field !== 'object') {
        return entity;
    }
    const normalized = normalizeEntityMappings(field.Value);
    if (normalized === field.Value) {
        return entity;
    }
    return Object.assign(Object.assign({}, entity), { EntityMappings: Object.assign(Object.assign({}, field), { Value: normalized }) });
}
/**
 * v4 adapter for `DashboardTab`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.15 renamed `DashboardTabEntity.Id` to `EntityId`
 * *inside* the release window, so stored tab documents can carry either spelling on any 4.x
 * platform. Read both, always write `EntityId`.
 *
 * Deliberately not handled:
 * - `EntityMapping` (singular, `string -> string`), the short-lived early-4.15 field, is **not**
 *   mapped onto `EntityMappings` (`string -> DashboardTabEntity`): the structures differ and the
 *   `Type` half is unknown. It is left on the payload untouched.
 * - Writing `EntityMappings` (or `PlaceholderValues`/`PlaceholderDefinition`/`MasterTabId`) to a
 *   platform below 4.15 silently loses the data, because the server drops unknown properties.
 *   That is data loss an adapter cannot repair, so it stays behind the `entityMappings` feature
 *   flag (`lib/api/features.ts`) - apps check `supports('entityMappings')` before writing.
 */
exports.dashboardTabAdapterV4 = {
    fromWire(wire, ctx) {
        if (!wire || typeof wire !== 'object' || !ctx.isV4) {
            return wire;
        }
        // Applies on every 4.x: the rename happened mid-4.15 and old documents were never migrated.
        return normalizeEntityMappingsField(wire);
    },
    toWire(entity, ctx) {
        if (!entity || typeof entity !== 'object' || !ctx.isV4) {
            return entity;
        }
        // Canonical is already `EntityId`; this only drops a stray `Id` that survived a read.
        return normalizeEntityMappingsField(entity);
    },
};
