/**
 * Status of a historical value operation.
 *
 * v5 narrows the wire enum to `Pending | Completed | Failed`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`). The two v4-only
 * values are kept so apps that persisted or switched on them still compile; the v4 adapter
 * maps them onto the canonical three on read.
 */
export enum HistoricalValueOperationStatus {
  /** Queued or currently running. */
  Pending = 'Pending',
  /**
   * @deprecated v4 only: the operation was running. Canonically reported as `Pending`.
   */
  Processing = 'Processing',
  /** Finished successfully. */
  Completed = 'Completed',
  /** Finished with an error; see `ErrorMessage`. */
  Failed = 'Failed',
  /**
   * @deprecated v4 only: a completed operation that was undone again. Canonically reported as
   * `Completed` with `IsRedoable: true`.
   */
  Undone = 'Undone',
}

/**
 * Canonical `HistoricalValueOperation`, following the v5 contract (decision 2 of
 * docs/v4-v5-compatibility-plan.md).
 *
 * The v4 payload is mapped in `lib/compat/adapters/historical-value-operation.adapter.v4.ts`:
 * `CreatedBy -> UserId`, `CreatedOn -> StartedOn`, `ChangedOn -> StoppedOn` (only for finished
 * operations). The v4-only fields below are kept optional and deprecated so existing apps keep
 * working; they are deleted when the minimum version is raised to 5.x.
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

  /**
   * @deprecated v4 only. The timezone the operation ran in. Still accepted as a start request
   * parameter on both versions, but no longer part of the response on v5.
   */
  Timezone?: string;
  /**
   * @deprecated v4 only. Use `StartedOn`.
   */
  CreatedOn?: Date | string;
  /**
   * @deprecated v4 only. Use `UserId`.
   */
  CreatedBy?: string;
  /**
   * @deprecated v4 only. Use `StoppedOn`.
   */
  ChangedOn?: Date | string;
  /**
   * @deprecated v4 only. The last user who changed the operation (undo/redo).
   */
  ChangedBy?: string;
}
