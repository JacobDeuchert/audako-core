import { vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';

/** v4 style config: no `/v1` in any per-service path. */
export const V4_CONFIG = {
  Services: {
    BaseUri: 'https://host/api',
    Structure: '/structure',
    Historian: '/historian',
    Driver: '/driver',
    Live: '/live',
  },
  Authentication: null,
} as unknown as HttpConfig;

/** v5 style config: `/v1` moved into the per-service paths, `Live` not migrated yet. */
export const V5_CONFIG = {
  Services: {
    BaseUri: 'https://host/api',
    Structure: '/v1/structure',
    Historian: '/v1/historian',
    Driver: '/v1/driver',
    Live: '/live',
  },
  Authentication: null,
} as unknown as HttpConfig;

export interface StubbedContext {
  ctx: ApiContext;
  /** Spy on the context's axios instance. Resolves `{ data: null, headers: {} }` by default. */
  request: ReturnType<typeof vi.fn>;
}

/**
 * Builds an {@link ApiContext} with an explicit version (so nothing is probed) and replaces
 * `request` on its axios instance with a spy. Everything in the services goes through
 * `ctx.http.request`, so this is the only interception point needed.
 */
export function stubContext(platformVersion: string, httpConfig?: HttpConfig): StubbedContext {
  const isV5 = platformVersion.startsWith('5');
  const ctx = new ApiContext(
    httpConfig || (isV5 ? V5_CONFIG : V4_CONFIG),
    'token',
    createApiVersionInfo(platformVersion),
  );

  const request = vi.fn().mockResolvedValue({ data: null, headers: {} });
  vi.spyOn(ctx.http, 'request').mockImplementation(request as any);

  return { ctx: ctx, request: request };
}
