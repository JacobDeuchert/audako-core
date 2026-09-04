import { describe, expect, it } from 'vitest';
import { DataConnectionBrowserService } from '../../lib/services/data-connection-browser.service.js';
import { stubContext } from './api-context-stub.js';

function service(platformVersion: string) {
  const stub = stubContext(platformVersion);
  stub.request.mockResolvedValue({ data: [{ address: 'ns=2;i=1' }], headers: {} });
  return { service: new DataConnectionBrowserService(stub.ctx), request: stub.request };
}

describe('DataConnectionBrowserService.browseConnection', () => {
  it('posts {Path} to the driver browse route on v4', async () => {
    const { service: svc, request } = service('4.23.0');

    await expect(svc.browseConnection('c1', '/root')).resolves.toEqual([{ address: 'ns=2;i=1' }]);
    expect(request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'https://host/api/driver/command/conn/c1/browse',
      data: { Path: '/root' },
    });
  });

  it('uses the v1 driver path on v5', async () => {
    const { service: svc, request } = service('5.0.0');

    await svc.browseConnection('c1', '');
    expect(request.mock.calls[0][0].url).toBe('https://host/api/v1/driver/command/conn/c1/browse');
  });
});
