import { HttpConfig } from '../models/http-config.model.js';
export declare abstract class BaseHttpService {
    protected httpConfig: HttpConfig;
    protected accessToken: string;
    constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>);
    protected getAuthorizationHeader(): {
        [p: string]: string;
    };
    protected getStructureUrl(): string;
    static requestHttpConfig(systemUrl: string): Promise<HttpConfig>;
}
