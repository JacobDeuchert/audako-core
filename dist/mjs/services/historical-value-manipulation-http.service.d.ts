import { HistoricalValueOperation } from '../models/historical-value-operation.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export declare class HistoricalValueManipulationHttpService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    getHistoricalValueOperations(signalId: string): Promise<HistoricalValueOperation[]>;
    startHistoricalValueOperation(signalId: string, from: Date, till: Date, timezone: string, operationScript: string, operationDescription: string): Promise<HistoricalValueOperation>;
    undoHistoricalValueOperation(operationId: string): Promise<void>;
    redoHistoricalValueOperation(operationId: string): Promise<void>;
    private getBaseUrl;
}
