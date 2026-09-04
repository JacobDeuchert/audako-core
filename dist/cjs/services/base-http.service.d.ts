import { ApiContext } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { Endpoint, ResolvedEndpoint } from '../compat/endpoints/endpoint-resolver.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
export declare abstract class BaseHttpService {
    protected ctx: ApiContext;
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead. This form cannot carry version information and
     * will be removed in a future major.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    /** `HttpConfig` of the target system. */
    protected getHttpConfig(): Promise<HttpConfig>;
    /** Detected platform version of the target system. */
    protected getVersionInfo(): Promise<ApiVersionInfo>;
    /** Resolves an endpoint for the detected API version. */
    protected resolve(endpoint: Endpoint): Promise<ResolvedEndpoint>;
    protected getAuthorizationHeader(): Promise<{
        [p: string]: string;
    }>;
    protected getAccessToken(): Promise<string>;
    protected getStructureUrl(): Promise<string>;
    /**
     * @deprecated Use the `httpConfig` accessor of the `ApiContext` instead.
     */
    protected get httpConfig(): AsyncValue<HttpConfig>;
    static requestHttpConfig(systemUrl: string): Promise<HttpConfig>;
    /**
     * Probes the anonymous version endpoint. The v1 path is tried first: with the legacy proxy
     * rewrite disabled the pre-v1 path falls through to the UI catch-all and answers HTML 200,
     * which would be a false positive (docs/analysis/v4-to-v5-endpoints.md section 5).
     */
    static isApiReachable(apiUrl: string): Promise<boolean>;
}
