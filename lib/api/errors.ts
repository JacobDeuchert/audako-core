import type { CompatibilityResult } from './compatibility.js';

/**
 * Base error for anything the platform answered with. v5 replies with RFC 7807
 * `application/problem+json` where `title` carries the error code (e.g. `Signal.NotFound`);
 * v4 replied with `{ error: { code, message, args } }` and only 400/500.
 */
export class ApiError extends Error {
  /** HTTP status code, or 0 when the request never got a response. */
  public readonly status: number;
  /** RFC 7807 `title`. On v5 this is the platform error code. */
  public readonly title: string;
  /** RFC 7807 `detail`, i.e. the human readable description. */
  public readonly detail: string;
  /** RFC 7807 `type` URI, when present. */
  public readonly type: string;
  /** RFC 7807 `instance`, when present. */
  public readonly instance: string;
  /** Raw response body, for callers that need extensions such as `errors`. */
  public readonly raw: any;

  constructor(init: {
    status?: number;
    title?: string;
    detail?: string;
    type?: string;
    instance?: string;
    raw?: any;
    message?: string;
  }) {
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
 * Normalizes an axios error into an {@link ApiError}. Understands RFC 7807 problem+json (v5),
 * the v4 `{ error: { code, message } }` envelope and plain text/empty bodies (JWT failures return
 * `text/plain`, unhandled v5 exceptions return an empty 500).
 */
export function parseApiError(error: any): ApiError {
  const response = error?.response;
  const status: number = response?.status || 0;
  const data = response?.data;

  if (data && typeof data === 'object') {
    // v5: RFC 7807 problem+json. `title` is the error code, `detail` the description.
    if (typeof data.title === 'string' || typeof data.detail === 'string') {
      return new ApiError({
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
      return new ApiError({
        status: status,
        title: data.error.code,
        detail: data.error.message,
        raw: data,
      });
    }
  }

  if (typeof data === 'string' && data.length > 0) {
    return new ApiError({ status: status, detail: data, raw: data });
  }

  return new ApiError({
    status: status,
    detail: error?.message,
    raw: data,
    message: error?.message,
  });
}

/**
 * Thrown when a platform version cannot be used at all: outside core's supported window,
 * an unknown major, or an unparseable version string.
 */
export class UnsupportedApiVersionError extends Error {
  /** Version string that was rejected. */
  public readonly platformVersion: string;

  constructor(platformVersion: string, message?: string) {
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
  /** Structured outcome of the compatibility check. */
  public readonly result: CompatibilityResult;

  constructor(result: CompatibilityResult) {
    super(result.message);
    this.name = 'IncompatibleBackendError';
    this.result = result;
  }
}

/** Thrown when version detection could not reach or make sense of the platform. */
export class ApiVersionDetectionError extends Error {
  /** URL that was probed. */
  public readonly apiUrl: string;
  /** Underlying error, when there was one. */
  public readonly cause: any;

  constructor(apiUrl: string, message?: string, cause?: any) {
    super(message || `Could not detect the audako platform version at ${apiUrl}`);
    this.name = 'ApiVersionDetectionError';
    this.apiUrl = apiUrl;
    this.cause = cause;
  }
}
