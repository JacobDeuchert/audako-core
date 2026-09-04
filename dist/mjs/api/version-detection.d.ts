import { ApiVersionInfo } from './api-version.js';
import { HttpConfig } from '../models/http-config.model.js';
/** The v5 version endpoint. Anonymous, returns a bare string. */
export declare const V5_VERSION_PATH = "/api/v1/structure/about/version";
/** The pre-v1 version endpoint. Only reachable while the legacy proxy rewrite is enabled. */
export declare const V4_VERSION_PATH = "/api/structure/about/version";
export interface DetectApiVersionOptions {
    /**
     * Skip probing and use this exact version string. Intended for tests and for proxied systems
     * whose version endpoint is not reachable.
     */
    platformVersion?: string;
    /**
     * Config of the target system. When it carries `ApiVersion`, that value is used instead of
     * probing (see plan open item 3).
     */
    httpConfig?: HttpConfig;
    /** Request timeout per probe in milliseconds. Defaults to 10000. */
    timeoutMs?: number;
}
/**
 * Normalizes a version response body. The endpoint returns a bare string, but proxies and
 * `responseType` handling can hand it over JSON-quoted (`"5.1.0"`).
 */
export declare function normalizeVersionBody(body: unknown): string | null;
/**
 * Detects the platform version of a system.
 *
 * Probes `{apiUrl}/api/v1/structure/about/version` (v5) first and falls back to the pre-v1
 * path (v4). HTML bodies are rejected, because the legacy path can return the UI's fallback
 * page with status 200. An explicit `platformVersion` option, or an `ApiVersion` key in a
 * supplied `HttpConfig`, short-circuits the probing.
 *
 * @param apiUrl Base URL of the system without the `/api` suffix (e.g. `https://host`).
 */
export declare function detectApiVersion(apiUrl: string, options?: DetectApiVersionOptions): Promise<ApiVersionInfo>;
