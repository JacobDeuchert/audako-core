import { describe, expect, it, vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { V4_CONFIG, V5_CONFIG } from './api-context-stub.js';
import {
  clampLiveInterval,
  DEFAULT_LIVE_INTERVAL_MS,
  LiveValueService,
  MIN_LIVE_INTERVAL_MS_V5,
} from '../../lib/services/live-value.service.js';

function createService(version: '4.23.0' | '5.0.0') {
  const ctx = new ApiContext(version.startsWith('4') ? V4_CONFIG : V5_CONFIG, 'token', createApiVersionInfo(version));
  return { ctx: ctx, service: new LiveValueService(ctx) };
}

describe('LiveValueService hub URL', () => {
  it('resolves {live}/hub on v4', async () => {
    const { service } = createService('4.23.0');
    await expect(service.getHubUrl()).resolves.toBe('https://host/api/live/hub');
  });

  it('resolves {live}/values on v5', async () => {
    const { service } = createService('5.0.0');
    await expect(service.getHubUrl()).resolves.toBe('https://host/api/live/values');
  });

  it('connect passes the resolved URL to connectWithUrl (no real connection)', async () => {
    const { service } = createService('5.0.0');
    const connectWithUrl = vi.spyOn(service, 'connectWithUrl').mockResolvedValue(undefined);

    await service.connect();

    expect(connectWithUrl).toHaveBeenCalledWith('https://host/api/live/values');
  });

  it('respects a system that already serves live under /v1', async () => {
    const ctx = new ApiContext(
      {
        Services: { BaseUri: 'https://host/api', Structure: '/v1/structure', Live: '/v1/live' },
        Authentication: null,
      } as unknown as HttpConfig,
      'token',
      createApiVersionInfo('5.1.0'),
    );

    await expect(new LiveValueService(ctx).getHubUrl()).resolves.toBe('https://host/api/v1/live/values');
  });
});

describe('clampLiveInterval', () => {
  it('raises sub-250 ms intervals on v5', () => {
    expect(clampLiveInterval(100, createApiVersionInfo('5.0.0'))).toBe(MIN_LIVE_INTERVAL_MS_V5);
    expect(clampLiveInterval(DEFAULT_LIVE_INTERVAL_MS, createApiVersionInfo('5.0.0'))).toBe(500);
  });

  it('passes intervals through on v4 and when the version is unknown', () => {
    expect(clampLiveInterval(100, createApiVersionInfo('4.23.0'))).toBe(100);
    expect(clampLiveInterval(100)).toBe(100);
  });
});

describe('LiveValueService constructors', () => {
  it('accepts an ApiContext', () => {
    const { ctx, service } = createService('5.0.0');
    expect((service as any).ctx).toBe(ctx);
  });

  it('still accepts the deprecated (httpConfig, accessToken) form', async () => {
    const service = new LiveValueService(V4_CONFIG, 'token');
    const ctx = (service as any).ctx as ApiContext;

    expect(ctx).toBeInstanceOf(ApiContext);
    await expect(ctx.getAccessToken()).resolves.toBe('token');
    await expect(ctx.getHttpConfig()).resolves.toBe(V4_CONFIG);
  });
});
