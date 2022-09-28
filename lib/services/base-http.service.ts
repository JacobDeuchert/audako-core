import axios from 'axios';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
import { PromiseUtils } from '../utils/promise-utils.js';

export abstract class BaseHttpService {
  

  constructor(protected httpConfig: HttpConfig, private accessToken: string | Promise<string> | Observable<string>) {
    if (PromiseUtils.isPromise(accessToken)) {
      accessToken.then((token) => (this.accessToken = token));
    } else {
      this.accessToken = accessToken;
    }
  }

  protected async getAuthorizationHeader(): Promise<{ [p: string]: string }> {
    let token: string = '';

    if (isObservable(this.accessToken)) {
      token = await firstValueFrom(this.accessToken);
    } else if (PromiseUtils.isPromise(this.accessToken)) {
      token = await this.accessToken;
    } else {
      token = this.accessToken;
    }

    return {
      Authorization: `Bearer ${this.accessToken}`,
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

  protected getStructureUrl(): string {
    return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Structure}`;
  }

  public static requestHttpConfig(systemUrl: string): Promise<HttpConfig> {
    return axios
      .get<HttpConfig>(`${systemUrl}/assets/conf/application.config`)
      .then((response) => response.data); 
  }

  
}
