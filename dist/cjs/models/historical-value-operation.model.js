"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalValueOperationStatus = void 0;
/**
 * Status of a historical value operation.
 *
 * v5 narrows the wire enum to `Pending | Completed | Failed`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`). The two v4-only
 * values are kept so apps that persisted or switched on them still compile; the v4 adapter
 * maps them onto the canonical three on read.
 */
var HistoricalValueOperationStatus;
(function (HistoricalValueOperationStatus) {
    /** Queued or currently running. */
    HistoricalValueOperationStatus["Pending"] = "Pending";
    /**
     * @deprecated v4 only: the operation was running. Canonically reported as `Pending`.
     */
    HistoricalValueOperationStatus["Processing"] = "Processing";
    /** Finished successfully. */
    HistoricalValueOperationStatus["Completed"] = "Completed";
    /** Finished with an error; see `ErrorMessage`. */
    HistoricalValueOperationStatus["Failed"] = "Failed";
    /**
     * @deprecated v4 only: a completed operation that was undone again. Canonically reported as
     * `Completed` with `IsRedoable: true`.
     */
    HistoricalValueOperationStatus["Undone"] = "Undone";
})(HistoricalValueOperationStatus || (exports.HistoricalValueOperationStatus = HistoricalValueOperationStatus = {}));
