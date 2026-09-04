import axios from 'axios';
import { ApiVersionInfo, createApiVersionInfo } from './api-version.js';
import { ApiVersionDetectionError } from './errors.js';
import { HttpConfig } from '../models/http-config.model.js';

/** The v5 version endpoint. Anonymous, returns a bare string. */
export const V5_VERSION_PATH = '/api/v1/structure/about/version';
/** The pre-v1 version endpoint. Only reachable while the legacy proxy rewrite is enabled. */
export const V4_VERSION_PATH = '/api/structure/about/version';

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
 * True when the body looks like the proxy's HTML fallback page instead of a version string.
 * With `ReverseProxy:Legacy:Structure` off, `/api/structure/...` falls through to the UI
 * catch-all and answers HTML with status 200 (see docs/analysis/v4-to-v5-endpoints.md section 5).
 */
function isHtmlBody(body: string): boolean {
  return body.trim().startsWith('<');
}

/**
 * Normalizes a version response body. The endpoint returns a bare string, but proxies and
 * `responseType` handling can hand it over JSON-quoted (`"5.1.0"`).
 */
export function normalizeVersionBody(body: unknown): string | null {
  if (typeof body !== 'string') {
    return null;
  }

  let value = body.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1).trim();
  }

  if (!value || isHtmlBody(value) || value.toLowerCase() === 'unknown') {
    return null;
  }

  return value;
}

async function probe(url: string, timeoutMs: number): Promise<string | null> {
  const response = await axios.get(url, {
    responseType: 'text',
    transformResponse: [(data: any) => data],
    timeout: timeoutMs,
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    return null;
  }

  return normalizeVersionBody(response.data);
}

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
export async function detectApiVersion(apiUrl: string, options: DetectApiVersionOptions = {}): Promise<ApiVersionInfo> {
  const override = options.platformVersion || options.httpConfig?.ApiVersion;
  if (override) {
    return createApiVersionInfo(override);
  }

  const base = (apiUrl || '').replace(/\/+$/, '');
  const timeoutMs = options.timeoutMs || 10000;
  let lastError: any = null;

  for (const path of [V5_VERSION_PATH, V4_VERSION_PATH]) {
    try {
      const version = await probe(`${base}${path}`, timeoutMs);
      if (version) {
        return createApiVersionInfo(version);
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw new ApiVersionDetectionError(base, undefined, lastError);
}
