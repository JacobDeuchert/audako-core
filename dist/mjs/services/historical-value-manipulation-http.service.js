var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { historicalValueOperationFromWire, historicalValueOperationsFromWire, } from '../compat/adapters/historical-value-operation.adapter.v4.js';
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
    getHistoricalValueOperations(signalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValueOperations', signalId: signalId }),
                this.getVersionInfo(),
            ]);
            const response = yield this.ctx.http.get(endpoint.url);
            return historicalValueOperationsFromWire(response.data, versionInfo);
        });
    }
    startHistoricalValueOperation(signalId, from, till, timezone, operationScript, operationDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const [endpoint, versionInfo] = yield Promise.all([
                this.resolve({ name: 'historicalValueOperationStart', signalId: signalId }),
                this.getVersionInfo(),
            ]);
            // Request body is identical on both versions.
            const response = yield this.ctx.http.post(endpoint.url, {
                From: from,
                Till: till,
                Timezone: timezone,
                OperationScript: operationScript,
                OperationDescription: operationDescription,
            });
            return historicalValueOperationFromWire(response.data, versionInfo);
        });
    }
    /** v4 accepts `PUT` only; v5 accepts both and prefers `POST`. The verb comes from the resolver. */
    undoHistoricalValueOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValueOperationUndo', operationId: operationId });
            yield this.ctx.http.request({ url: endpoint.url, method: endpoint.method, data: null });
        });
    }
    /** See {@link undoHistoricalValueOperation}. */
    redoHistoricalValueOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'historicalValueOperationRedo', operationId: operationId });
            yield this.ctx.http.request({ url: endpoint.url, method: endpoint.method, data: null });
        });
    }
}
