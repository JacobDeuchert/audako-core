import axios from 'axios';
import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
import { PromiseUtils } from '../utils/promise-utils.js';

export abstract class BaseHttpService {
  protected accessToken: string;

  constructor(protected httpConfig: HttpConfig, accessToken: string | Promise<string>) {
    if (PromiseUtils.isPromise(accessToken)) {
      accessToken.then((token) => (this.accessToken = token));
    } else {
      this.accessToken = accessToken;
    }
  }

  protected getAuthorizationHeader(): { [p: string]: string } {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  protected getStructureUrl(): string {
    return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Structure}`;
  }

  public static requestHttpConfig(systemUrl: string): Promise<HttpConfig> {
    return axios
      .get<HttpConfig>(`${systemUrl}/assets/conf/application.config`)
      .then((response) => response.data); 
  }
}
