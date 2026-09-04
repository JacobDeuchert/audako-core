"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalValueOperationStatus = void 0;
/**
 * Status of a historical value operation.
 *
 * Canonically the three v5 values `Pending | Completed | Failed`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`). The v4-only wire
 * values `Processing` and `Undone` are mapped onto these by the v4 adapter on read.
 */
var HistoricalValueOperationStatus;
(function (HistoricalValueOperationStatus) {
    /** Queued or currently running. */
    HistoricalValueOperationStatus["Pending"] = "Pending";
    /** Finished successfully. */
    HistoricalValueOperationStatus["Completed"] = "Completed";
    /** Finished with an error; see `ErrorMessage`. */
    HistoricalValueOperationStatus["Failed"] = "Failed";
})(HistoricalValueOperationStatus || (exports.HistoricalValueOperationStatus = HistoricalValueOperationStatus = {}));
