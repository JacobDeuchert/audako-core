var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { createDeprecationInterceptor } from '../compat/deprecation-logger.js';
import { resolveEndpoint } from '../compat/endpoints/endpoint-resolver.js';
import { assertCompatible } from './compatibility.js';
import { detectApiVersion } from './version-detection.js';
/**
 * Fetches a system's `application.config`.
 *
 * @param systemUrl Base URL of the audako UI, without a trailing slash.
 */
export function requestHttpConfig(systemUrl) {
    return axios.get(`${systemUrl}/assets/conf/application.config`).then((response) => response.data);
}
/**
 * Everything a service needs to talk to one audako system: its `HttpConfig`, the access token
 * and the detected platform version. Replaces the old `(httpConfig, accessToken)` service
 * constructor arguments.
 */
export class ApiContext {
    constructor(httpConfig, accessToken, versionInfo) {
        this._httpConfig = httpConfig;
        this._accessToken = accessToken;
        this._versionInfo = versionInfo;
    }
    /** Builds a context from a plain object. */
    static from(options) {
        return new ApiContext(options.httpConfig, options.accessToken, options.versionInfo);
    }
    /**
     * Connect-time convenience: loads the system's config, detects the platform version and
     * asserts it is compatible before any real request is made.
     *
     * @throws IncompatibleBackendError when the platform is outside the supported window.
     */
    static connect(systemUrl, accessToken, requirements) {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield requestHttpConfig(systemUrl);
            const versionInfo = yield detectApiVersion(ApiContext.getApiRootUrl(httpConfig, systemUrl), {
                httpConfig: httpConfig,
            });
            assertCompatible(versionInfo, requirements);
            return new ApiContext(httpConfig, accessToken, versionInfo);
        });
    }
    /**
     * Root URL to probe for the version endpoint: `Services.BaseUri` without its trailing `/api`,
     * falling back to the given system URL when the config has no `BaseUri`.
     */
    static getApiRootUrl(httpConfig, fallbackUrl = '') {
        var _a;
        const baseUri = (_a = httpConfig === null || httpConfig === void 0 ? void 0 : httpConfig.Services) === null || _a === void 0 ? void 0 : _a.BaseUri;
        if (!baseUri) {
            return fallbackUrl.replace(/\/+$/, '');
        }
        return baseUri.replace(/\/+$/, '').replace(/\/api$/i, '');
    }
    /** Resolved `HttpConfig` of the target system. */
    getHttpConfig() {
        return getAsyncValueAsPromise(this._httpConfig);
    }
    /** Current access token. */
    getAccessToken() {
        return getAsyncValueAsPromise(this._accessToken);
    }
    /** `Authorization` header for the current access token. */
    getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getAccessToken();
            return { Authorization: `Bearer ${token}` };
        });
    }
    /**
     * Detected platform version. When no version was supplied to the constructor it is detected
     * once, lazily, from the config's `BaseUri` (or its `ApiVersion` key) and cached.
     */
    getVersionInfo() {
        if (this._versionInfo) {
            return getAsyncValueAsPromise(this._versionInfo);
        }
        if (!this._versionInfoPromise) {
            this._versionInfoPromise = this.getHttpConfig().then((httpConfig) => detectApiVersion(ApiContext.getApiRootUrl(httpConfig), { httpConfig: httpConfig }));
        }
        return this._versionInfoPromise;
    }
    /** Resolves an endpoint for the detected API version. */
    resolve(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const [httpConfig, versionInfo] = yield Promise.all([this.getHttpConfig(), this.getVersionInfo()]);
            return resolveEndpoint(httpConfig, versionInfo.apiVersion, endpoint);
        });
    }
    /**
     * Shared axios instance with an `Authorization` request interceptor and the deprecation
     * response interceptor installed. Services should use this instead of the global `axios`.
     */
    get http() {
        if (!this._http) {
            const instance = axios.create();
            instance.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
                const token = yield this.getAccessToken();
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            }));
            instance.interceptors.response.use(createDeprecationInterceptor());
            this._http = instance;
        }
        return this._http;
    }
}
