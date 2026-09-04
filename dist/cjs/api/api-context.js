"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiContext = exports.requestHttpConfig = void 0;
const axios_1 = __importDefault(require("axios"));
const async_value_utils_js_1 = require("../utils/async-value-utils.js");
const deprecation_logger_js_1 = require("../compat/deprecation-logger.js");
const endpoint_resolver_js_1 = require("../compat/endpoints/endpoint-resolver.js");
const compatibility_js_1 = require("./compatibility.js");
const version_detection_js_1 = require("./version-detection.js");
/**
 * Fetches a system's `application.config`.
 *
 * @param systemUrl Base URL of the audako UI, without a trailing slash.
 */
function requestHttpConfig(systemUrl) {
    return axios_1.default.get(`${systemUrl}/assets/conf/application.config`).then((response) => response.data);
}
exports.requestHttpConfig = requestHttpConfig;
/**
 * Everything a service needs to talk to one audako system: its `HttpConfig`, the access token
 * and the detected platform version. Replaces the old `(httpConfig, accessToken)` service
 * constructor arguments.
 */
class ApiContext {
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
            const versionInfo = yield (0, version_detection_js_1.detectApiVersion)(ApiContext.getApiRootUrl(httpConfig, systemUrl), {
                httpConfig: httpConfig,
            });
            (0, compatibility_js_1.assertCompatible)(versionInfo, requirements);
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
        return (0, async_value_utils_js_1.getAsyncValueAsPromise)(this._httpConfig);
    }
    /** Current access token. */
    getAccessToken() {
        return (0, async_value_utils_js_1.getAsyncValueAsPromise)(this._accessToken);
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
            return (0, async_value_utils_js_1.getAsyncValueAsPromise)(this._versionInfo);
        }
        if (!this._versionInfoPromise) {
            this._versionInfoPromise = this.getHttpConfig().then((httpConfig) => (0, version_detection_js_1.detectApiVersion)(ApiContext.getApiRootUrl(httpConfig), { httpConfig: httpConfig }));
        }
        return this._versionInfoPromise;
    }
    /** Resolves an endpoint for the detected API version. */
    resolve(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const [httpConfig, versionInfo] = yield Promise.all([this.getHttpConfig(), this.getVersionInfo()]);
            return (0, endpoint_resolver_js_1.resolveEndpoint)(httpConfig, versionInfo.apiVersion, endpoint);
        });
    }
    /**
     * Shared axios instance with an `Authorization` request interceptor and the deprecation
     * response interceptor installed. Services should use this instead of the global `axios`.
     */
    get http() {
        if (!this._http) {
            const instance = axios_1.default.create();
            instance.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
                const token = yield this.getAccessToken();
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            }));
            instance.interceptors.response.use((0, deprecation_logger_js_1.createDeprecationInterceptor)());
            this._http = instance;
        }
        return this._http;
    }
}
exports.ApiContext = ApiContext;
