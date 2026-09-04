/**
 * Base error for anything the platform answered with. v5 replies with RFC 7807
 * `application/problem+json` where `title` carries the error code (e.g. `Signal.NotFound`);
 * v4 replied with `{ error: { code, message, args } }` and only 400/500.
 */
export class ApiError extends Error {
    constructor(init) {
        super(init.message || init.detail || init.title || 'Request failed');
        this.name = 'ApiError';
        this.status = init.status || 0;
        this.title = init.title || '';
        this.detail = init.detail || '';
        this.type = init.type || '';
        this.instance = init.instance || '';
        this.raw = init.raw;
    }
}
/**
 * `423 Locked`: the entity or one of its ancestors is part of a locked subtree, so the write was
 * refused. New in v5 (docs/analysis/v4-to-v5-endpoints.md, `updateEntity` / `deleteEntity`).
 */
export class EntityLockedError extends ApiError {
    constructor(init) {
        super(init);
        this.name = 'EntityLockedError';
    }
}
/** Picks the most specific {@link ApiError} subclass for a parsed error body. */
function createApiError(init) {
    return init.status === 423 ? new EntityLockedError(init) : new ApiError(init);
}
/**
 * Normalizes an axios error into an {@link ApiError}. Understands RFC 7807 problem+json (v5),
 * the v4 `{ error: { code, message } }` envelope and plain text/empty bodies (JWT failures return
 * `text/plain`, unhandled v5 exceptions return an empty 500).
 */
export function parseApiError(error) {
    const response = error === null || error === void 0 ? void 0 : error.response;
    const status = (response === null || response === void 0 ? void 0 : response.status) || 0;
    const data = response === null || response === void 0 ? void 0 : response.data;
    if (data && typeof data === 'object') {
        // v5: RFC 7807 problem+json. `title` is the error code, `detail` the description.
        if (typeof data.title === 'string' || typeof data.detail === 'string') {
            return createApiError({
                status: status,
                title: data.title,
                detail: data.detail,
                type: data.type,
                instance: data.instance,
                raw: data,
            });
        }
        // v4: { error: { code, message, args } }
        if (data.error && typeof data.error === 'object') {
            return createApiError({
                status: status,
                title: data.error.code,
                detail: data.error.message,
                raw: data,
            });
        }
    }
    if (typeof data === 'string' && data.length > 0) {
        return createApiError({ status: status, detail: data, raw: data });
    }
    return createApiError({
        status: status,
        detail: error === null || error === void 0 ? void 0 : error.message,
        raw: data,
        message: error === null || error === void 0 ? void 0 : error.message,
    });
}
/**
 * Thrown when a platform version cannot be used at all: outside core's supported window,
 * an unknown major, or an unparseable version string.
 */
export class UnsupportedApiVersionError extends Error {
    constructor(platformVersion, message) {
        super(message || `Unsupported audako platform version: ${platformVersion}`);
        this.name = 'UnsupportedApiVersionError';
        this.platformVersion = platformVersion;
    }
}
/**
 * Thrown by `assertCompatible` when the detected platform does not satisfy the requirements.
 * Carries the full {@link CompatibilityResult} so apps can render a precise message.
 */
export class IncompatibleBackendError extends Error {
    constructor(result) {
        super(result.message);
        this.name = 'IncompatibleBackendError';
        this.result = result;
    }
}
/** Thrown when version detection could not reach or make sense of the platform. */
export class ApiVersionDetectionError extends Error {
    constructor(apiUrl, message, cause) {
        super(message || `Could not detect the audako platform version at ${apiUrl}`);
        this.name = 'ApiVersionDetectionError';
        this.apiUrl = apiUrl;
        this.cause = cause;
    }
}
