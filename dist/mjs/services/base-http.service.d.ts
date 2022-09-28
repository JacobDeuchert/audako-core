import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
export declare abstract class BaseHttpService {
    protected httpConfig: HttpConfig;
    private accessToken;
    constructor(httpConfig: HttpConfig, accessToken: string | Promise<string> | Observable<string>);
    protected getAuthorizationHeader(): Promise<{
        [p: string]: string;
    }>;
    protected getAccessTokenAsPromise(): Promise<string>;
    protected getStructureUrl(): string;
    static requestHttpConfig(systemUrl: string): Promise<HttpConfig>;
}
