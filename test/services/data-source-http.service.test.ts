import { describe, expect, it, vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { DataSourceHttpService } from '../../lib/services/data-source-http.service.js';

const v4Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/structure', Driver: '/driver' },
  Authentication: null,
} as unknown as HttpConfig;

const v5Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/v1/structure', Driver: '/v1/driver' },
  Authentication: null,
} as unknown as HttpConfig;

function createService(version: '4.23.0' | '5.0.0') {
  const ctx = new ApiContext(version.startsWith('4') ? v4Config : v5Config, 'token', createApiVersionInfo(version));
  return {
    service: new DataSourceHttpService(ctx),
    get: vi.spyOn(ctx.http, 'get').mockResolvedValue({ status: 200, data: '' } as any),
  };
}

describe('DataSourceHttpService.sendDatSrcConfiguration', () => {
  it('awaits the driver URL (the URL used to contain [object Promise])', async () => {
    const { service, get } = createService('4.23.0');

    await service.sendDatSrcConfiguration('source-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/driver/command/source/source-1/configure');
    expect(get.mock.calls[0][0]).not.toContain('Promise');
  });

  it('uses the v5 driver path', async () => {
    const { service, get } = createService('5.0.0');

    await service.sendDatSrcConfiguration('source-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/v1/driver/command/source/source-1/configure');
  });

  it('returns null for the empty v4 response', async () => {
    const { service } = createService('4.23.0');

    await expect(service.sendDatSrcConfiguration('source-1')).resolves.toBeNull();
  });

  it('returns the job info from the v5 response', async () => {
    const { service, get } = createService('5.0.0');
    get.mockResolvedValue({
      status: 200,
      data: { JobId: 'job-1', Timestamp: '2026-01-01T00:00:00Z' },
    } as any);

    await expect(service.sendDatSrcConfiguration('source-1')).resolves.toEqual({
      JobId: 'job-1',
      Timestamp: '2026-01-01T00:00:00Z',
    });
  });

  it('returns null for a body without a JobId', async () => {
    const { service, get } = createService('5.0.0');
    get.mockResolvedValue({ status: 200, data: {} } as any);

    await expect(service.sendDatSrcConfiguration('source-1')).resolves.toBeNull();
  });
});
