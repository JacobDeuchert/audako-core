import { describe, expect, it } from 'vitest';
import { TenantHttpService } from '../../lib/services/tenant-http.service.js';
import { stubContext } from './api-context-stub.js';

function service(platformVersion: string) {
  const stub = stubContext(platformVersion);
  stub.request.mockResolvedValue({ data: [], headers: {} });
  return { service: new TenantHttpService(stub.ctx), request: stub.request };
}

describe('TenantHttpService URL resolution', () => {
  it('uses the singular v4 routes', async () => {
    const { service: svc, request } = service('4.23.0');

    await svc.getTenantViewById('t1');
    await svc.getTenantViewForEntityId('e1');
    await svc.getTopTenants();
    await svc.getNextTenants('t1');
    await svc.filterTenantsByName('abc');

    expect(request.mock.calls.map((call) => call[0].url)).toEqual([
      'https://host/api/structure/tenant/t1/view',
      'https://host/api/structure/tenant/entity/e1/view',
      'https://host/api/structure/tenant/top',
      'https://host/api/structure/tenant/t1/next',
      'https://host/api/structure/tenant/filter/abc',
    ]);
  });

  it('uses the plural v5 routes', async () => {
    const { service: svc, request } = service('5.0.0');

    await svc.getTenantViewById('t1');
    await svc.getTenantViewForEntityId('e1');
    await svc.getTopTenants();
    await svc.getNextTenants('t1');
    await svc.filterTenantsByName('abc');

    expect(request.mock.calls.map((call) => call[0].url)).toEqual([
      'https://host/api/v1/structure/tenants/t1/view',
      'https://host/api/v1/structure/tenants/entities/e1/view',
      'https://host/api/v1/structure/tenants/top',
      'https://host/api/v1/structure/tenants/t1/next',
      'https://host/api/v1/structure/tenants/filter/abc',
    ]);
    expect(request.mock.calls.every((call) => call[0].method === 'GET')).toBe(true);
  });
});
