import { ApiContext } from '../api/api-context.js';
import {
  historicalValueOperationFromWire,
  historicalValueOperationsFromWire,
} from '../compat/adapters/historical-value-operation.adapter.v4.js';
import { HistoricalValueOperation } from '../models/historical-value-operation.model.js';

/** Arguments of {@link HistoricalValueManipulationHttpService.startHistoricalValueOperation}. */
export interface StartHistoricalValueOperationRequest {
  From: Date | string;
  Till: Date | string;
  Timezone: string;
  OperationScript: string;
  OperationDescription: string;
}

/**
 * Historian value manipulation (undoable operation scripts).
 *
 * v4 served these under `{historian}/historicalvaluemanipulation/operations/...`, v5 under
 * `{historian}/historical-value-operations/...`, and the response model changed
 * (docs/analysis/v4-to-v5-endpoints.md). Responses are normalized to the canonical v5 shape by
 * `lib/compat/adapters/historical-value-operation.adapter.v4.ts`.
 */
export class HistoricalValueManipulationHttpService {
  constructor(public readonly ctx: ApiContext) {}

  public async getHistoricalValueOperations(signalId: string): Promise<HistoricalValueOperation[]> {
    const [response, versionInfo] = await Promise.all([
      this.ctx.request<HistoricalValueOperation[]>({ name: 'historicalValueOperations', signalId: signalId }),
      this.ctx.getVersionInfo(),
    ]);
    return historicalValueOperationsFromWire(response.data, versionInfo);
  }

  /** Request body is identical on both versions. */
  public async startHistoricalValueOperation(
    signalId: string,
    request: StartHistoricalValueOperationRequest,
  ): Promise<HistoricalValueOperation> {
    const [response, versionInfo] = await Promise.all([
      this.ctx.request<HistoricalValueOperation>(
        { name: 'historicalValueOperationStart', signalId: signalId },
        { data: request },
      ),
      this.ctx.getVersionInfo(),
    ]);
    return historicalValueOperationFromWire(response.data, versionInfo);
  }

  /** v4 accepts `PUT` only; v5 accepts both and prefers `POST`. The verb comes from the endpoint table. */
  public async undoHistoricalValueOperation(operationId: string): Promise<void> {
    await this.ctx.request<void>({ name: 'historicalValueOperationUndo', operationId: operationId });
  }

  /** See {@link undoHistoricalValueOperation}. */
  public async redoHistoricalValueOperation(operationId: string): Promise<void> {
    await this.ctx.request<void>({ name: 'historicalValueOperationRedo', operationId: operationId });
  }
}
