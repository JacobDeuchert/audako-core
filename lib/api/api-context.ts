import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue, getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { createDeprecationInterceptor } from '../compat/deprecation-logger.js';
import { Endpoint, resolveEndpoint, ResolvedEndpoint } from '../compat/endpoints/endpoint-resolver.js';
import { ApiVersionInfo } from './api-version.js';
import { assertCompatible, CompatibilityRequirements } from './compatibility.js';
import { parseApiError } from './errors.js';
import { detectApiVersion } from './version-detection.js';

/** Plain object form of an {@link ApiContext}, accepted by {@link ApiContext.from}. */
export interface ApiContextOptions {
  httpConfig: AsyncValue<HttpConfig>;
  accessToken: AsyncValue<string>;
  versionInfo?: AsyncValue<ApiVersionInfo>;
}

/** Per-request options of {@link ApiContext.request}. */
export interface RequestOptions {
  /**
   * HTTP verb. Required for endpoints whose verb the caller chooses (`entityById`,
   * `userProfile`); otherwise the endpoint table's verb is used.
   */
  method?: string;
  /** Request body. */
  data?: any;
  /**
   * Query string parameters. Serialized and percent-encoded by axios, so JSON values such as a
   * `$filter` are safe to pass as-is.
   */
  params?: { [p: string]: any };
  headers?: { [p: string]: string };
}

/**
 * Fetches a system's `application.config`.
 *
 * @param systemUrl Base URL of the audako UI, without a trailing slash.
 */
export function requestHttpConfig(systemUrl: string): Promise<HttpConfig> {
  return axios.get<HttpConfig>(`${systemUrl}/assets/conf/application.config`).then((response) => response.data);
}

/**
 * Everything a service needs to talk to one audako system: its `HttpConfig`, the access token
 * and the detected platform version, plus {@link ApiContext.request}, the one way services
 * reach the platform.
 */
export class ApiContext {
  private _httpConfig: AsyncValue<HttpConfig>;
  private _accessToken: AsyncValue<string>;
  private _versionInfo?: AsyncValue<ApiVersionInfo>;
  private _versionInfoPromise?: Promise<ApiVersionInfo>;
  private _http?: AxiosInstance;

  constructor(
    httpConfig: AsyncValue<HttpConfig>,
    accessToken: AsyncValue<string>,
    versionInfo?: AsyncValue<ApiVersionInfo>,
  ) {
    this._httpConfig = httpConfig;
    this._accessToken = accessToken;
    this._versionInfo = versionInfo;
  }

  /** Builds a context from a plain object. */
  public static from(options: ApiContextOptions): ApiContext {
    return new ApiContext(options.httpConfig, options.accessToken, options.versionInfo);
  }

  /**
   * Connect-time convenience: loads the system's config, detects the platform version and
   * asserts it is compatible before any real request is made.
   *
   * @throws IncompatibleBackendError when the platform is outside the supported window.
   */
  public static async connect(
    systemUrl: string,
    accessToken: AsyncValue<string>,
    requirements?: CompatibilityRequirements,
  ): Promise<ApiContext> {
    const httpConfig = await requestHttpConfig(systemUrl);
    const versionInfo = await detectApiVersion(ApiContext.getApiRootUrl(httpConfig, systemUrl), {
      httpConfig: httpConfig,
      accessToken: accessToken,
    });
    assertCompatible(versionInfo, requirements);
    return new ApiContext(httpConfig, accessToken, versionInfo);
  }

  /**
   * Root URL to probe for the version endpoint: `Services.BaseUri` without its trailing `/api`,
   * falling back to the given system URL when the config has no `BaseUri`.
   */
  public static getApiRootUrl(httpConfig: HttpConfig, fallbackUrl = ''): string {
    const baseUri = httpConfig?.Services?.BaseUri;
    if (!baseUri) {
      return fallbackUrl.replace(/\/+$/, '');
    }
    return baseUri.replace(/\/+$/, '').replace(/\/api$/i, '');
  }

  /** Resolved `HttpConfig` of the target system. */
  public getHttpConfig(): Promise<HttpConfig> {
    return getAsyncValueAsPromise(this._httpConfig);
  }

  /** Current access token. */
  public getAccessToken(): Promise<string> {
    return getAsyncValueAsPromise(this._accessToken);
  }

  /** `Authorization` header for the current access token. */
  public async getAuthorizationHeader(): Promise<{ [p: string]: string }> {
    const token = await this.getAccessToken();
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Detected platform version. When no version was supplied to the constructor it is detected
   * once, lazily, from the config's `BaseUri` (or its `ApiVersion` key) and cached.
   */
  public getVersionInfo(): Promise<ApiVersionInfo> {
    if (this._versionInfo) {
      return getAsyncValueAsPromise(this._versionInfo);
    }

    if (!this._versionInfoPromise) {
      this._versionInfoPromise = this.getHttpConfig()
        .then((httpConfig) =>
          detectApiVersion(ApiContext.getApiRootUrl(httpConfig), {
            httpConfig: httpConfig,
            accessToken: () => this.getAccessToken(),
          }),
        )
        .catch((error) => {
          // Do not cache a failure: a transient network error during detection would otherwise
          // break every later request on this context.
          this._versionInfoPromise = undefined;
          throw error;
        });
    }

    return this._versionInfoPromise;
  }

  /**
   * Resolves an endpoint for the detected API version.
   *
   * @throws EndpointNotAvailableError when the endpoint does not exist on that version.
   */
  public async resolve(endpoint: Endpoint): Promise<ResolvedEndpoint> {
    const [httpConfig, versionInfo] = await Promise.all([this.getHttpConfig(), this.getVersionInfo()]);
    return resolveEndpoint(httpConfig, versionInfo.apiVersion, endpoint);
  }

  /**
   * Resolves `endpoint` and runs the request on {@link http}. Every failure, including transport
   * errors, is normalized to an `ApiError` (or `EntityLockedError` on 423).
   *
   * @throws EndpointNotAvailableError when the endpoint does not exist on the detected version.
   * @throws ApiError for any failed request.
   */
  public async request<T = any>(endpoint: Endpoint, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    const resolved = await this.resolve(endpoint);
    const method = options.method || resolved.method;
    if (!method) {
      throw new Error(`Endpoint "${endpoint.name}" needs an explicit HTTP method.`);
    }

    try {
      return await this.http.request<T, AxiosResponse<T>>({
        method: method,
        url: resolved.url,
        data: options.data,
        params: options.params,
        headers: options.headers,
      });
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Shared axios instance with an `Authorization` request interceptor and the deprecation
   * response interceptor installed. Prefer {@link request}; use this directly only for requests
   * outside the endpoint table.
   */
  public get http(): AxiosInstance {
    if (!this._http) {
      const instance = axios.create();
      instance.interceptors.request.use(async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
      });
      instance.interceptors.response.use(createDeprecationInterceptor());
      this._http = instance;
    }
    return this._http;
  }
}
