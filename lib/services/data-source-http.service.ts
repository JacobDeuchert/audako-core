import axios from 'axios';
import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model';
import { BaseHttpService } from './base-http.service';

export class DataSourceHttpService extends BaseHttpService {
  constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>) {
    super(httpConfig, accessToken);
  }

  public async sendDatSrcConfiguration(dataSourceId: string): Promise<void> {
    const url = `${this._getDriverUrl()}/command/source/${dataSourceId}/configure`;
    const headers = this.getAuthorizationHeader();
    const response = await axios.get(url, { headers: headers });
    return response.data;
  }

  private _getDriverUrl(): string {
    return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Driver}`;
  }
}
