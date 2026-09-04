"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOffsetBodyToWire = exports.measuredValuePackageFromWire = exports.measuredValueFromWire = void 0;
/**
 * Normalizes a single value payload to the canonical `MeasuredValue`.
 *
 * v5 already answers with a full `MeasuredValue` (every property present, `Value` free-form).
 * v4 answered with the flat historical value, which carried at most one note as the
 * `Note`/`CreatedBy` pair - that pair is lifted into `Notes` so callers only have to read one
 * shape. The v5-only `Min*`/`Max*` fields stay undefined on v4.
 */
function measuredValueFromWire(wire, versionInfo) {
    if (!wire || typeof wire !== 'object') {
        return wire;
    }
    if (versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isV5) {
        return wire;
    }
    const value = Object.assign({}, wire);
    if (!Array.isArray(value.Notes) && value.Note) {
        value.Notes = [
            {
                Note: value.Note,
                CreatedBy: value.CreatedBy,
                Timestamp: value.IntervalStart,
            },
        ];
    }
    return value;
}
exports.measuredValueFromWire = measuredValueFromWire;
/** {@link measuredValueFromWire} applied to a `MeasuredValuePackage` / v4 `HistoricalValueObject`. */
function measuredValuePackageFromWire(wire, versionInfo) {
    if (!wire || typeof wire !== 'object') {
        return wire;
    }
    if ((versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isV5) || !Array.isArray(wire.Values)) {
        return wire;
    }
    return Object.assign(Object.assign({}, wire), { Values: wire.Values.map((value) => measuredValueFromWire(value, versionInfo)) });
}
exports.measuredValuePackageFromWire = measuredValuePackageFromWire;
/**
 * Puts the custom counter offset body in the casing the target version expects.
 *
 * v4 read the body camelCase (`{timestamp, value, note, source}`); v5 uses PascalCase
 * (`SetCounterCustomOffsetRequest {Timestamp, Value, Note?, Source}`) and there is no legacy
 * rewrite for the endpoint, so the casing has to be right.
 */
function customOffsetBodyToWire(body, versionInfo) {
    var _a, _b;
    if (versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isV5) {
        return {
            Timestamp: body.Timestamp,
            Value: body.Value,
            Note: (_a = body.Note) !== null && _a !== void 0 ? _a : null,
            Source: body.Source,
        };
    }
    return {
        timestamp: body.Timestamp,
        value: body.Value,
        note: (_b = body.Note) !== null && _b !== void 0 ? _b : null,
        source: body.Source,
    };
}
exports.customOffsetBodyToWire = customOffsetBodyToWire;
