import { AxiosInstance } from 'axios';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { Endpoint, ResolvedEndpoint } from '../compat/endpoints/endpoint-resolver.js';
import { ApiVersionInfo } from './api-version.js';
import { CompatibilityRequirements } from './compatibility.js';
/** Plain object form of an {@link ApiContext}, accepted by {@link ApiContext.from}. */
export interface ApiContextOptions {
    httpConfig: AsyncValue<HttpConfig>;
    accessToken: AsyncValue<string>;
    versionInfo?: AsyncValue<ApiVersionInfo>;
}
/**
 * Fetches a system's `application.config`.
 *
 * @param systemUrl Base URL of the audako UI, without a trailing slash.
 */
export declare function requestHttpConfig(systemUrl: string): Promise<HttpConfig>;
/**
 * Everything a service needs to talk to one audako system: its `HttpConfig`, the access token
 * and the detected platform version. Replaces the old `(httpConfig, accessToken)` service
 * constructor arguments.
 */
export declare class ApiContext {
    private _httpConfig;
    private _accessToken;
    private _versionInfo?;
    private _versionInfoPromise?;
    private _http?;
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>, versionInfo?: AsyncValue<ApiVersionInfo>);
    /** Builds a context from a plain object. */
    static from(options: ApiContextOptions): ApiContext;
    /**
     * Connect-time convenience: loads the system's config, detects the platform version and
     * asserts it is compatible before any real request is made.
     *
     * @throws IncompatibleBackendError when the platform is outside the supported window.
     */
    static connect(systemUrl: string, accessToken: AsyncValue<string>, requirements?: CompatibilityRequirements): Promise<ApiContext>;
    /**
     * Root URL to probe for the version endpoint: `Services.BaseUri` without its trailing `/api`,
     * falling back to the given system URL when the config has no `BaseUri`.
     */
    static getApiRootUrl(httpConfig: HttpConfig, fallbackUrl?: string): string;
    /** Resolved `HttpConfig` of the target system. */
    getHttpConfig(): Promise<HttpConfig>;
    /** Current access token. */
    getAccessToken(): Promise<string>;
    /** `Authorization` header for the current access token. */
    getAuthorizationHeader(): Promise<{
        [p: string]: string;
    }>;
    /**
     * Detected platform version. When no version was supplied to the constructor it is detected
     * once, lazily, from the config's `BaseUri` (or its `ApiVersion` key) and cached.
     */
    getVersionInfo(): Promise<ApiVersionInfo>;
    /** Resolves an endpoint for the detected API version. */
    resolve(endpoint: Endpoint): Promise<ResolvedEndpoint>;
    /**
     * Shared axios instance with an `Authorization` request interceptor and the deprecation
     * response interceptor installed. Services should use this instead of the global `axios`.
     */
    get http(): AxiosInstance;
}
