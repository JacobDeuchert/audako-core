import {
  historicalValueOperationFromWire,
  historicalValueOperationsFromWire,
} from '../compat/adapters/historical-value-operation.adapter.v4.js';
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
export class HistoricalValueManipulationHttpService extends BaseHttpService {
  public async getHistoricalValueOperations(signalId: string): Promise<HistoricalValueOperation[]> {
    const [endpoint, versionInfo] = await Promise.all([
      this.resolve({ name: 'historicalValueOperations', signalId: signalId }),
      this.getVersionInfo(),
    ]);

    const response = await this.ctx.http.get<HistoricalValueOperation[]>(endpoint.url);
    return historicalValueOperationsFromWire(response.data, versionInfo);
  }

  public async startHistoricalValueOperation(
    signalId: string,
    from: Date,
    till: Date,
    timezone: string,
    operationScript: string,
    operationDescription: string,
  ): Promise<HistoricalValueOperation> {
    const [endpoint, versionInfo] = await Promise.all([
      this.resolve({ name: 'historicalValueOperationStart', signalId: signalId }),
      this.getVersionInfo(),
    ]);

    // Request body is identical on both versions.
    const response = await this.ctx.http.post<HistoricalValueOperation>(endpoint.url, {
      From: from,
      Till: till,
      Timezone: timezone,
      OperationScript: operationScript,
      OperationDescription: operationDescription,
    });
    return historicalValueOperationFromWire(response.data, versionInfo);
  }

  /** v4 accepts `PUT` only; v5 accepts both and prefers `POST`. The verb comes from the resolver. */
  public async undoHistoricalValueOperation(operationId: string): Promise<void> {
    const endpoint = await this.resolve({ name: 'historicalValueOperationUndo', operationId: operationId });
    await this.ctx.http.request<void>({ url: endpoint.url, method: endpoint.method, data: null });
  }

  /** See {@link undoHistoricalValueOperation}. */
  public async redoHistoricalValueOperation(operationId: string): Promise<void> {
    const endpoint = await this.resolve({ name: 'historicalValueOperationRedo', operationId: operationId });
    await this.ctx.http.request<void>({ url: endpoint.url, method: endpoint.method, data: null });
  }
}
