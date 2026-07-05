import axios from 'axios';
import { HistoricalValueOperation, HistoricalValueOperationStatus } from '../models/historical-value-operation.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export class HistoricalValueManipulationHttpService extends BaseHttpService {

  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
    super(httpConfig, accessToken);
  }

  public async getHistoricalValueOperations(signalId: string): Promise<HistoricalValueOperation[]> {
    const baseUrl = await this.getBaseUrl();
    const headers = await this.getAuthorizationHeader();
    const operations = await axios
      .get<HistoricalValueOperation[]>(`${baseUrl}/operations/${signalId}`, { headers })
      .then((response) => response.data);
    return operations;
  }

  public async startHistoricalValueOperation(
    signalId: string,
    from: Date,
    till: Date,
    timezone: string,
    operationScript: string,
    operationDescription: string
  ): Promise<HistoricalValueOperation> {
    const baseUrl = await this.getBaseUrl();
    const headers = await this.getAuthorizationHeader();
    return axios
      .post<HistoricalValueOperation>(
        `${baseUrl}/operations/${signalId}/start`,
        {
          From: from,
          Till: till,
          Timezone: timezone,
          OperationScript: operationScript,
          OperationDescription: operationDescription,
        },
        { headers }
      )
      .then((response) => response.data);
  }

  public async undoHistoricalValueOperation(operationId: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    const headers = await this.getAuthorizationHeader();
    return axios.put<void>(`${baseUrl}/operations/${operationId}/undo`, null, { headers }).then();
  }

  public async redoHistoricalValueOperation(operationId: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    const headers = await this.getAuthorizationHeader();
    return axios.put<void>(`${baseUrl}/operations/${operationId}/redo`, null, { headers }).then();
  }

  private async getBaseUrl(): Promise<string> {
    const httpConfig = await getAsyncValueAsPromise(this.httpConfig);
    return `${httpConfig.Services.BaseUri}${httpConfig.Services.Historian}/historicalvaluemanipulation`;
  }
}
