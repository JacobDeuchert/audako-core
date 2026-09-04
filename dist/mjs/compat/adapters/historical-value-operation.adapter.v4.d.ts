import { ApiVersionInfo } from '../../api/api-version.js';
import { HistoricalValueOperation, HistoricalValueOperationStatus } from '../../models/historical-value-operation.model.js';
/**
 * Maps a v4 status value onto the canonical (v5) three.
 *
 * - `Processing` meant "currently running"; v5 does not distinguish queued from running, both
 *   are `Pending`.
 * - `Undone` meant "completed, then rolled back"; v5 keeps `Completed` and expresses the undo
 *   state through `IsUndoable` / `IsRedoable`.
 */
export declare function mapV4OperationStatus(status: string | undefined): HistoricalValueOperationStatus;
/**
 * Normalizes one operation payload to the canonical shape. v5 payloads pass through unchanged;
 * v4 payloads get `UserId` / `StartedOn` / `StoppedOn` derived from the old audit fields and
 * `IsUndoable` / `IsRedoable` derived from the old status. The v4-only keys are dropped, so
 * callers only ever see the canonical shape.
 */
export declare function historicalValueOperationFromWire(wire: any, versionInfo: ApiVersionInfo): HistoricalValueOperation;
/** {@link historicalValueOperationFromWire} for a list response. */
export declare function historicalValueOperationsFromWire(wire: any, versionInfo: ApiVersionInfo): HistoricalValueOperation[];
