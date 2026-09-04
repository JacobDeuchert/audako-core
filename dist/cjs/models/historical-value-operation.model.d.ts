/**
 * Status of a historical value operation.
 *
 * Canonically the three v5 values `Pending | Completed | Failed`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`). The v4-only wire
 * values `Processing` and `Undone` are mapped onto these by the v4 adapter on read.
 */
export declare enum HistoricalValueOperationStatus {
    /** Queued or currently running. */
    Pending = "Pending",
    /** Finished successfully. */
    Completed = "Completed",
    /** Finished with an error; see `ErrorMessage`. */
    Failed = "Failed"
}
/**
 * Canonical `HistoricalValueOperation`, following the v5 contract (decision 2 of
 * docs/v4-v5-compatibility-plan.md).
 *
 * The v4 payload is mapped in `lib/compat/adapters/historical-value-operation.adapter.v4.ts`:
 * `CreatedBy -> UserId`, `CreatedOn -> StartedOn`, `ChangedOn -> StoppedOn` (only for finished
 * operations). The v4-only wire fields are not part of this type; the adapter types them
 * locally.
 *
 * Ask `versionInfo.supports('historicalValueOperationsV2')` before relying on `Progress`,
 * `IsUndoable`, `IsRedoable`, `LiveOperationId` or `Layer`.
 */
export interface HistoricalValueOperation {
    Id: string;
    SignalId: string;
    From: Date | string;
    Till: Date | string;
    OperationScript: string;
    OperationDescription: string;
    Status: HistoricalValueOperationStatus;
    /** Id of the user who started the operation. On v4 derived from `CreatedBy`. */
    UserId?: string;
    /** When the operation started. On v4 derived from `CreatedOn`. */
    StartedOn?: Date | string;
    /** When the operation finished, `null` while it is still running. On v4 derived from `ChangedOn`. */
    StoppedOn?: Date | string | null;
    /** Error text of a `Failed` operation. v5 only. */
    ErrorMessage?: string | null;
    /** Progress in percent. v5 only. */
    Progress?: number;
    /** v5 only; on v4 derived from the status. */
    IsUndoable?: boolean;
    /** v5 only; on v4 derived from the status. */
    IsRedoable?: boolean;
    /** Id to subscribe to over the live hub with the `OP:` prefix. v5 only. */
    LiveOperationId?: string | null;
    /** Storage layer the operation writes to. v5 only. */
    Layer?: string | number | null;
}
