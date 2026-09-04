import { ApiVersionInfo } from '../../api/api-version.js';
import {
  HistoricalValueOperation,
  HistoricalValueOperationStatus,
} from '../../models/historical-value-operation.model.js';

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

/**
 * v4 wire shape of an operation. `Timezone` and the four audit fields are gone in v5; they are
 * mapped onto the canonical fields and then dropped.
 */
interface V4HistoricalValueOperation {
  Id: string;
  SignalId: string;
  From: Date | string;
  Till: Date | string;
  Timezone?: string;
  OperationScript: string;
  OperationDescription: string;
  /** `Pending | Processing | Completed | Failed | Undone`. */
  Status?: string;
  CreatedOn?: Date | string;
  CreatedBy?: string;
  ChangedOn?: Date | string;
  ChangedBy?: string;
}

/** True for a v4 status that means "the operation is over". */
function isFinished(status: string | undefined): boolean {
  return (
    status === HistoricalValueOperationStatus.Completed ||
    status === HistoricalValueOperationStatus.Failed ||
    status === V4_STATUS_UNDONE
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
export function mapV4OperationStatus(status: string | undefined): HistoricalValueOperationStatus {
  switch (status) {
    case V4_STATUS_PROCESSING:
      return HistoricalValueOperationStatus.Pending;
    case V4_STATUS_UNDONE:
      return HistoricalValueOperationStatus.Completed;
    case HistoricalValueOperationStatus.Completed:
    case HistoricalValueOperationStatus.Failed:
    case HistoricalValueOperationStatus.Pending:
      return status as HistoricalValueOperationStatus;
    default:
      return HistoricalValueOperationStatus.Pending;
  }
}

/**
 * Normalizes one operation payload to the canonical shape. v5 payloads pass through unchanged;
 * v4 payloads get `UserId` / `StartedOn` / `StoppedOn` derived from the old audit fields and
 * `IsUndoable` / `IsRedoable` derived from the old status. The v4-only keys are dropped, so
 * callers only ever see the canonical shape.
 */
export function historicalValueOperationFromWire(wire: any, versionInfo: ApiVersionInfo): HistoricalValueOperation {
  if (!wire || typeof wire !== 'object') {
    return wire;
  }

  if (versionInfo?.isV5) {
    return wire as HistoricalValueOperation;
  }

  const legacy = wire as V4HistoricalValueOperation & Partial<HistoricalValueOperation>;
  const legacyStatus: string | undefined = legacy.Status;
  const finished = isFinished(legacyStatus);

  const { Timezone, CreatedOn, CreatedBy, ChangedOn, ChangedBy, ...rest } = legacy;

  return {
    ...rest,
    Status: mapV4OperationStatus(legacyStatus),
    // v4 had no dedicated user field: the creator of the operation is its owner.
    UserId: legacy.UserId ?? CreatedBy,
    // v4 `CreatedOn` was written when the operation was queued, which is when it starts.
    StartedOn: legacy.StartedOn ?? CreatedOn,
    // v4 `ChangedOn` was touched on every status change; only a finished operation has a
    // meaningful stop time. Still running -> null, matching v5.
    StoppedOn: legacy.StoppedOn ?? (finished ? (ChangedOn ?? null) : null),
    // v4 exposed neither flag; derive them from the status the same way the UI used to.
    IsUndoable: legacy.IsUndoable ?? legacyStatus === HistoricalValueOperationStatus.Completed,
    IsRedoable: legacy.IsRedoable ?? legacyStatus === V4_STATUS_UNDONE,
  } as HistoricalValueOperation;
}

/** {@link historicalValueOperationFromWire} for a list response. */
export function historicalValueOperationsFromWire(wire: any, versionInfo: ApiVersionInfo): HistoricalValueOperation[] {
  if (!Array.isArray(wire)) {
    return [];
  }
  return wire.map((operation) => historicalValueOperationFromWire(operation, versionInfo));
}
