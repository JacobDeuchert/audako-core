import axios from 'axios';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export class DataConnectionBrowserService extends BaseHttpService {
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
    super(httpConfig, accessToken);
  }

  public async browseConnection(id: string, path: string): Promise<any> {
    const url = `${await this._getDriverUrl()}/command/conn/${id}/browse`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.post(url, { Path: path }, { headers: headers });
    return response.data;
  }

  private async _getDriverUrl(): Promise<string> {
    const httpConfig = await getAsyncValueAsPromise(this.httpConfig);
    return `${httpConfig.Services.BaseUri}${httpConfig.Services.Driver}`;
  }
}
