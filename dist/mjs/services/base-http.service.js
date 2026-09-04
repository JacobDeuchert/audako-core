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
import { ApiContext, requestHttpConfig } from '../api/api-context.js';
import { V4_VERSION_PATH, V5_VERSION_PATH } from '../api/version-detection.js';
export class BaseHttpService {
    constructor(httpConfigOrCtx, accessToken) {
        this.ctx =
            httpConfigOrCtx instanceof ApiContext
                ? httpConfigOrCtx
                : new ApiContext(httpConfigOrCtx, accessToken);
    }
    /** `HttpConfig` of the target system. */
    getHttpConfig() {
        return this.ctx.getHttpConfig();
    }
    /** Detected platform version of the target system. */
    getVersionInfo() {
        return this.ctx.getVersionInfo();
    }
    /** Resolves an endpoint for the detected API version. */
    resolve(endpoint) {
        return this.ctx.resolve(endpoint);
    }
    getAuthorizationHeader() {
        return this.ctx.getAuthorizationHeader();
    }
    getAccessToken() {
        return this.ctx.getAccessToken();
    }
    /**
     * @deprecated Resolve endpoints with {@link resolve} instead: the structure service path
     * differs per platform version, and only the resolver knows the per-version routes.
     */
    getStructureUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield this.getHttpConfig();
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Structure}`;
        });
    }
    /**
     * @deprecated Use the `httpConfig` accessor of the `ApiContext` instead.
     */
    get httpConfig() {
        return () => this.ctx.getHttpConfig();
    }
    static requestHttpConfig(systemUrl) {
        return requestHttpConfig(systemUrl);
    }
    /**
     * Probes the anonymous version endpoint. The v1 path is tried first: with the legacy proxy
     * rewrite disabled the pre-v1 path falls through to the UI catch-all and answers HTML 200,
     * which would be a false positive (docs/analysis/v4-to-v5-endpoints.md section 5).
     */
    static isApiReachable(apiUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const base = (apiUrl || '').replace(/\/+$/, '');
            for (const path of [V5_VERSION_PATH, V4_VERSION_PATH]) {
                try {
                    const response = yield axios.get(`${base}${path}`, {
                        responseType: 'text',
                        transformResponse: [(data) => data],
                    });
                    const body = typeof response.data === 'string' ? response.data.trim() : '';
                    if (response.status === 200 && !body.startsWith('<')) {
                        return true;
                    }
                }
                catch (error) {
                    if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
}
