import type { CompatibilityResult } from './compatibility.js';
/**
 * Base error for anything the platform answered with. v5 replies with RFC 7807
 * `application/problem+json` where `title` carries the error code (e.g. `Signal.NotFound`);
 * v4 replied with `{ error: { code, message, args } }` and only 400/500.
 */
export declare class ApiError extends Error {
    /** HTTP status code, or 0 when the request never got a response. */
    readonly status: number;
    /** RFC 7807 `title`. On v5 this is the platform error code. */
    readonly title: string;
    /** RFC 7807 `detail`, i.e. the human readable description. */
    readonly detail: string;
    /** RFC 7807 `type` URI, when present. */
    readonly type: string;
    /** RFC 7807 `instance`, when present. */
    readonly instance: string;
    /** Raw response body, for callers that need extensions such as `errors`. */
    readonly raw: any;
    constructor(init: {
        status?: number;
        title?: string;
        detail?: string;
        type?: string;
        instance?: string;
        raw?: any;
        message?: string;
    });
}
/**
 * `423 Locked`: the entity or one of its ancestors is part of a locked subtree, so the write was
 * refused. New in v5 (docs/analysis/v4-to-v5-endpoints.md, `updateEntity` / `deleteEntity`).
 */
export declare class EntityLockedError extends ApiError {
    constructor(init: ConstructorParameters<typeof ApiError>[0]);
}
/**
 * Normalizes an axios error into an {@link ApiError}. Understands RFC 7807 problem+json (v5),
 * the v4 `{ error: { code, message } }` envelope and plain text/empty bodies (JWT failures return
 * `text/plain`, unhandled v5 exceptions return an empty 500).
 */
export declare function parseApiError(error: any): ApiError;
/**
 * Thrown when a platform version cannot be used at all: outside core's supported window,
 * an unknown major, or an unparseable version string.
 */
export declare class UnsupportedApiVersionError extends Error {
    /** Version string that was rejected. */
    readonly platformVersion: string;
    constructor(platformVersion: string, message?: string);
}
/**
 * Thrown by `assertCompatible` when the detected platform does not satisfy the requirements.
 * Carries the full {@link CompatibilityResult} so apps can render a precise message.
 */
export declare class IncompatibleBackendError extends Error {
    /** Structured outcome of the compatibility check. */
    readonly result: CompatibilityResult;
    constructor(result: CompatibilityResult);
}
/** Thrown when version detection could not reach or make sense of the platform. */
export declare class ApiVersionDetectionError extends Error {
    /** URL that was probed. */
    readonly apiUrl: string;
    /** Underlying error, when there was one. */
    readonly cause: any;
    constructor(apiUrl: string, message?: string, cause?: any);
}
