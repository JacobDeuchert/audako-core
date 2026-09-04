import { HistoricalValueOperation } from '../models/historical-value-operation.model.js';
import { BaseHttpService } from './base-http.service.js';
/**
 * Historian value manipulation (undoable operation scripts).
 *
 * v4 served these under `{historian}/historicalvaluemanipulation/operations/...`, v5 under
 * `{historian}/historical-value-operations/...`, and the response model changed
 * (docs/analysis/v4-to-v5-endpoints.md). Responses are normalized to the canonical v5 shape by
 * `lib/compat/adapters/historical-value-operation.adapter.v4.ts`.
 */
export declare class HistoricalValueManipulationHttpService extends BaseHttpService {
    getHistoricalValueOperations(signalId: string): Promise<HistoricalValueOperation[]>;
    startHistoricalValueOperation(signalId: string, from: Date, till: Date, timezone: string, operationScript: string, operationDescription: string): Promise<HistoricalValueOperation>;
    /** v4 accepts `PUT` only; v5 accepts both and prefers `POST`. The verb comes from the resolver. */
    undoHistoricalValueOperation(operationId: string): Promise<void>;
    /** See {@link undoHistoricalValueOperation}. */
    redoHistoricalValueOperation(operationId: string): Promise<void>;
}
