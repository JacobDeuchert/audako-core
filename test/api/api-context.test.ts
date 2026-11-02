import { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { V5_VERSION_PATH } from '../../lib/api/version-detection.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';

const httpConfig = {
  Services: { BaseUri: 'https://host/api', Structure: '/v1/structure' },
  Authentication: null,
} as unknown as HttpConfig;

/** Answers every request with `body` and records it, so nothing reaches the network. */
function recordingAdapter(body: unknown) {
  const requests: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config);
    return { data: body, status: 200, statusText: 'OK', headers: {}, config };
  };
  return { adapter, requests };
}

describe('ApiContext adapter', () => {
  it('sends the requests of the context through the adapter, token included', async () => {
    const { adapter, requests } = recordingAdapter('{"Id":"user"}');
    const ctx = ApiContext.from({ httpConfig, accessToken: 'token', adapter });

    await ctx.http.get('https://host/api/v1/structure/user-profile');

    expect(requests).toHaveLength(1);
    expect(requests[0].headers.get('Authorization')).toBe('Bearer token');
  });

  it('detects the version through the adapter', async () => {
    const { adapter, requests } = recordingAdapter('5.1.0');
    const ctx = ApiContext.from({ httpConfig, accessToken: 'token', adapter });

    const info = await ctx.getVersionInfo();

    expect(info.platformVersion).toBe('5.1.0');
    expect(requests[0].url).toBe(`https://host${V5_VERSION_PATH}`);
  });
});

describe('ApiContext.getApiRootUrl', () => {
  const withBaseUri = (BaseUri: string) => ({ Services: { BaseUri }, Authentication: null }) as unknown as HttpConfig;

  it('strips a v4 /api', () => {
    expect(ApiContext.getApiRootUrl(withBaseUri('https://host/api/'))).toBe('https://host');
  });

  it('strips a v5 /api/v1', () => {
    expect(ApiContext.getApiRootUrl(withBaseUri('https://platform.example/api/v1'))).toBe('https://platform.example');
  });

  it('falls back to the system URL without a BaseUri', () => {
    expect(ApiContext.getApiRootUrl({ Services: null } as unknown as HttpConfig, 'https://host/')).toBe('https://host');
  });
});

describe('ApiContext with a v5 BaseUri', () => {
  it('knows v5 without a request', async () => {
    const { adapter, requests } = recordingAdapter('');
    const ctx = ApiContext.from({
      httpConfig: { Services: { BaseUri: 'https://platform.example/api/v1', Structure: '/structure' } } as never,
      accessToken: 'token',
      adapter,
    });

    const info = await ctx.getVersionInfo();

    expect(info.apiVersion).toBe('V5');
    expect(requests).toHaveLength(0);
  });
});
