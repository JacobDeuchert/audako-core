import axios from 'axios';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export class DataSourceHttpService extends BaseHttpService {
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
    super(httpConfig, accessToken);
  }

  public async sendDatSrcConfiguration(dataSourceId: string): Promise<void> {
    const url = `${this._getDriverUrl()}/command/source/${dataSourceId}/configure`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.get(url, { headers: headers });
    return response.data;
  }

  private async _getDriverUrl(): Promise<string> {

    const httpConfig = await getAsyncValueAsPromise(this.httpConfig)
    return `${httpConfig.Services.BaseUri}${httpConfig.Services.Driver}`;
  }
}
