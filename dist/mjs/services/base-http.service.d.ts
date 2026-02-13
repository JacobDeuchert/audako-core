import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
export declare abstract class BaseHttpService {
    protected httpConfig: AsyncValue<HttpConfig>;
    private accessToken;
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    protected getAuthorizationHeader(): Promise<{
        [p: string]: string;
    }>;
    protected getAccessToken(): Promise<string>;
    protected getStructureUrl(): Promise<string>;
    static requestHttpConfig(systemUrl: string): Promise<HttpConfig>;
    static isApiReachable(apiUrl: string): Promise<boolean>;
}
