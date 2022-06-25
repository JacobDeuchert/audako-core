import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model';

export abstract class BaseHttpService {
  protected accessToken: string;

  constructor(protected httpConfig: HttpConfig, accessToken: string | Observable<string>) {
    if (accessToken instanceof Observable) {
      accessToken.subscribe((token) => (this.accessToken = token));
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
}
