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
exports.historicalValueOperationsFromWire = exports.historicalValueOperationFromWire = exports.mapV4OperationStatus = void 0;
const historical_value_operation_model_js_1 = require("../../models/historical-value-operation.model.js");
/**
 * v4 -> canonical mapping for `HistoricalValueOperation`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`).
 *
 * v5 wire shape: `{Id, SignalId, UserId, StartedOn, StoppedOn?, Status, ErrorMessage, Progress,
 * From, Till, OperationScript, OperationDescription, IsUndoable, IsRedoable, LiveOperationId,
 * Layer}` with `Status: Pending | Completed | Failed` - that is the canonical model.
 *
 * The v4 shape is typed locally below; it is a wire detail and deliberately not part of the
 * public model.
 */
/** v4-only status values. v5 narrowed the wire enum to the canonical three. */
const V4_STATUS_PROCESSING = 'Processing';
const V4_STATUS_UNDONE = 'Undone';
/** True for a v4 status that means "the operation is over". */
function isFinished(status) {
    return (status === historical_value_operation_model_js_1.HistoricalValueOperationStatus.Completed ||
        status === historical_value_operation_model_js_1.HistoricalValueOperationStatus.Failed ||
        status === V4_STATUS_UNDONE);
}
/**
 * Maps a v4 status value onto the canonical (v5) three.
 *
 * - `Processing` meant "currently running"; v5 does not distinguish queued from running, both
 *   are `Pending`.
 * - `Undone` meant "completed, then rolled back"; v5 keeps `Completed` and expresses the undo
 *   state through `IsUndoable` / `IsRedoable`.
 */
function mapV4OperationStatus(status) {
    switch (status) {
        case V4_STATUS_PROCESSING:
            return historical_value_operation_model_js_1.HistoricalValueOperationStatus.Pending;
        case V4_STATUS_UNDONE:
            return historical_value_operation_model_js_1.HistoricalValueOperationStatus.Completed;
        case historical_value_operation_model_js_1.HistoricalValueOperationStatus.Completed:
        case historical_value_operation_model_js_1.HistoricalValueOperationStatus.Failed:
        case historical_value_operation_model_js_1.HistoricalValueOperationStatus.Pending:
            return status;
        default:
            return historical_value_operation_model_js_1.HistoricalValueOperationStatus.Pending;
    }
}
exports.mapV4OperationStatus = mapV4OperationStatus;
/**
 * Normalizes one operation payload to the canonical shape. v5 payloads pass through unchanged;
 * v4 payloads get `UserId` / `StartedOn` / `StoppedOn` derived from the old audit fields and
 * `IsUndoable` / `IsRedoable` derived from the old status. The v4-only keys are dropped, so
 * callers only ever see the canonical shape.
 */
function historicalValueOperationFromWire(wire, versionInfo) {
    var _a, _b, _c, _d, _e;
    if (!wire || typeof wire !== 'object') {
        return wire;
    }
    if (versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isV5) {
        return wire;
    }
    const legacy = wire;
    const legacyStatus = legacy.Status;
    const finished = isFinished(legacyStatus);
    const { Timezone, CreatedOn, CreatedBy, ChangedOn, ChangedBy } = legacy, rest = __rest(legacy, ["Timezone", "CreatedOn", "CreatedBy", "ChangedOn", "ChangedBy"]);
    return Object.assign(Object.assign({}, rest), { Status: mapV4OperationStatus(legacyStatus), 
        // v4 had no dedicated user field: the creator of the operation is its owner.
        UserId: (_a = legacy.UserId) !== null && _a !== void 0 ? _a : CreatedBy, 
        // v4 `CreatedOn` was written when the operation was queued, which is when it starts.
        StartedOn: (_b = legacy.StartedOn) !== null && _b !== void 0 ? _b : CreatedOn, 
        // v4 `ChangedOn` was touched on every status change; only a finished operation has a
        // meaningful stop time. Still running -> null, matching v5.
        StoppedOn: (_c = legacy.StoppedOn) !== null && _c !== void 0 ? _c : (finished ? (ChangedOn !== null && ChangedOn !== void 0 ? ChangedOn : null) : null), 
        // v4 exposed neither flag; derive them from the status the same way the UI used to.
        IsUndoable: (_d = legacy.IsUndoable) !== null && _d !== void 0 ? _d : legacyStatus === historical_value_operation_model_js_1.HistoricalValueOperationStatus.Completed, IsRedoable: (_e = legacy.IsRedoable) !== null && _e !== void 0 ? _e : legacyStatus === V4_STATUS_UNDONE });
}
exports.historicalValueOperationFromWire = historicalValueOperationFromWire;
/** {@link historicalValueOperationFromWire} for a list response. */
function historicalValueOperationsFromWire(wire, versionInfo) {
    if (!Array.isArray(wire)) {
        return [];
    }
    return wire.map((operation) => historicalValueOperationFromWire(operation, versionInfo));
}
exports.historicalValueOperationsFromWire = historicalValueOperationsFromWire;
