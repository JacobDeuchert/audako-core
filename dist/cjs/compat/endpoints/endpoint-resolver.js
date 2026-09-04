"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEndpoint = exports.getServiceUrls = void 0;
const errors_js_1 = require("../../api/errors.js");
const endpoints_v4_js_1 = require("./endpoints.v4.js");
const endpoints_v5_js_1 = require("./endpoints.v5.js");
/** Builds the per-service base URLs from an `HttpConfig`. */
function getServiceUrls(httpConfig) {
    const services = httpConfig === null || httpConfig === void 0 ? void 0 : httpConfig.Services;
    const base = (services === null || services === void 0 ? void 0 : services.BaseUri) || '';
    return {
        base: base,
        structure: `${base}${(services === null || services === void 0 ? void 0 : services.Structure) || ''}`,
        historian: `${base}${(services === null || services === void 0 ? void 0 : services.Historian) || ''}`,
        driver: `${base}${(services === null || services === void 0 ? void 0 : services.Driver) || ''}`,
        live: `${base}${(services === null || services === void 0 ? void 0 : services.Live) || ''}`,
    };
}
exports.getServiceUrls = getServiceUrls;
/**
 * Resolves an endpoint against the target system's config and API version.
 *
 * @throws UnsupportedApiVersionError when the endpoint does not exist on that API version
 *         (e.g. `entityCount` / `entityInfo` on v4 - gate those with `supports('entityCount')`).
 */
function resolveEndpoint(httpConfig, apiVersion, endpoint) {
    const table = apiVersion === 'V5' ? endpoints_v5_js_1.V5_ENDPOINTS : endpoints_v4_js_1.V4_ENDPOINTS;
    const builder = table[endpoint.name];
    if (!builder) {
        throw new errors_js_1.UnsupportedApiVersionError(apiVersion, `Endpoint "${endpoint.name}" does not exist on audako platform ${apiVersion}.`);
    }
    return builder(getServiceUrls(httpConfig), endpoint);
}
exports.resolveEndpoint = resolveEndpoint;
