import axios from 'axios';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { PromiseUtils } from '../utils/promise-utils.js';

export abstract class BaseHttpService {
  

  constructor(protected httpConfig: AsyncValue<HttpConfig>, private accessToken: AsyncValue<string>) {
    if (PromiseUtils.isPromise(accessToken)) {
      accessToken.then((token) => (this.accessToken = token));
    } else {
      this.accessToken = accessToken;
    }
  }

  protected async getAuthorizationHeader(): Promise<{ [p: string]: string }> {
    let token: string = await getAsyncValueAsPromise(this.accessToken);
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  protected getAccessTokenAsPromise(): Promise<string> {
    if (isObservable(this.accessToken)) {
      return firstValueFrom(this.accessToken);
    } else if (PromiseUtils.isPromise(this.accessToken)) {
      return this.accessToken;
    } else {
      return Promise.resolve(this.accessToken);
    }

  }

  protected async getStructureUrl(): Promise<string> {
    const httpConfig = await getAsyncValueAsPromise(this.httpConfig);
    return `${httpConfig.Services.BaseUri}${httpConfig.Services.Structure}`;
  }

  public static requestHttpConfig(systemUrl: string): Promise<HttpConfig> {
    return axios
      .get<HttpConfig>(`${systemUrl}/assets/conf/application.config`)
      .then((response) => response.data); 
  }

  
}
