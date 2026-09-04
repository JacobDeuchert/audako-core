import { ApiVersionInfo } from '../../api/api-version.js';
import {
  HistoricalValueOperation,
  HistoricalValueOperationStatus,
} from '../../models/historical-value-operation.model.js';

/**
 * v4 -> canonical mapping for `HistoricalValueOperation`
 * (docs/analysis/v4-to-v5-endpoints.md, `getHistoricalValueOperations`).
 *
 * v4 wire shape: `{Id, SignalId, From, Till, Timezone, OperationScript, OperationDescription,
 * Status, CreatedOn, CreatedBy, ChangedOn, ChangedBy}` with
 * `Status: Pending | Processing | Completed | Failed | Undone`.
 *
 * v5 wire shape: `{Id, SignalId, UserId, StartedOn, StoppedOn?, Status, ErrorMessage, Progress,
 * From, Till, OperationScript, OperationDescription, IsUndoable, IsRedoable, LiveOperationId,
 * Layer}` with `Status: Pending | Completed | Failed`.
 */

/** True for a v4 status that means "the operation is over". */
function isFinished(status: HistoricalValueOperationStatus | string | undefined): boolean {
  return (
    status === HistoricalValueOperationStatus.Completed ||
    status === HistoricalValueOperationStatus.Failed ||
    status === HistoricalValueOperationStatus.Undone
  );
}

/**
 * Maps a v4 status value onto the canonical (v5) three.
 *
 * - `Processing` meant "currently running"; v5 does not distinguish queued from running, both
 *   are `Pending`.
 * - `Undone` meant "completed, then rolled back"; v5 keeps `Completed` and expresses the undo
 *   state through `IsUndoable` / `IsRedoable`.
 */
export function mapV4OperationStatus(
  status: HistoricalValueOperationStatus | string | undefined,
): HistoricalValueOperationStatus {
  switch (status) {
    case HistoricalValueOperationStatus.Processing:
      return HistoricalValueOperationStatus.Pending;
    case HistoricalValueOperationStatus.Undone:
      return HistoricalValueOperationStatus.Completed;
    case HistoricalValueOperationStatus.Completed:
    case HistoricalValueOperationStatus.Failed:
    case HistoricalValueOperationStatus.Pending:
      return status;
    default:
      return HistoricalValueOperationStatus.Pending;
  }
}

/**
 * Normalizes one operation payload to the canonical shape. v5 payloads pass through unchanged;
 * v4 payloads get `UserId` / `StartedOn` / `StoppedOn` derived from the old audit fields and
 * `IsUndoable` / `IsRedoable` derived from the old status. The v4 fields themselves are kept
 * (deprecated on the model) so nothing an app already reads disappears.
 */
export function historicalValueOperationFromWire(wire: any, versionInfo: ApiVersionInfo): HistoricalValueOperation {
  if (!wire || typeof wire !== 'object') {
    return wire;
  }

  if (versionInfo?.isV5) {
    return wire as HistoricalValueOperation;
  }

  const legacyStatus = wire.Status;
  const finished = isFinished(legacyStatus);

  return {
    ...wire,
    Status: mapV4OperationStatus(legacyStatus),
    // v4 had no dedicated user field: the creator of the operation is its owner.
    UserId: wire.UserId ?? wire.CreatedBy,
    // v4 `CreatedOn` was written when the operation was queued, which is when it starts.
    StartedOn: wire.StartedOn ?? wire.CreatedOn,
    // v4 `ChangedOn` was touched on every status change; only a finished operation has a
    // meaningful stop time. Still running -> null, matching v5.
    StoppedOn: wire.StoppedOn ?? (finished ? wire.ChangedOn ?? null : null),
    // v4 exposed neither flag; derive them from the status the same way the UI used to.
    IsUndoable: wire.IsUndoable ?? legacyStatus === HistoricalValueOperationStatus.Completed,
    IsRedoable: wire.IsRedoable ?? legacyStatus === HistoricalValueOperationStatus.Undone,
  } as HistoricalValueOperation;
}

/** {@link historicalValueOperationFromWire} for a list response. */
export function historicalValueOperationsFromWire(
  wire: any,
  versionInfo: ApiVersionInfo,
): HistoricalValueOperation[] {
  if (!Array.isArray(wire)) {
    return [];
  }
  return wire.map((operation) => historicalValueOperationFromWire(operation, versionInfo));
}
