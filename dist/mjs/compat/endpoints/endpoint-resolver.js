import { UnsupportedApiVersionError } from '../../api/errors.js';
import { V4_ENDPOINTS } from './endpoints.v4.js';
import { V5_ENDPOINTS } from './endpoints.v5.js';
/** Builds the per-service base URLs from an `HttpConfig`. */
export function getServiceUrls(httpConfig) {
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
/**
 * Resolves an endpoint against the target system's config and API version.
 *
 * @throws UnsupportedApiVersionError when the endpoint does not exist on that API version
 *         (e.g. `entityCount` / `entityInfo` on v4 - gate those with `supports('entityCount')`).
 */
export function resolveEndpoint(httpConfig, apiVersion, endpoint) {
    const table = apiVersion === 'V5' ? V5_ENDPOINTS : V4_ENDPOINTS;
    const builder = table[endpoint.name];
    if (!builder) {
        throw new UnsupportedApiVersionError(apiVersion, `Endpoint "${endpoint.name}" does not exist on audako platform ${apiVersion}.`);
    }
    return builder(getServiceUrls(httpConfig), endpoint);
}
