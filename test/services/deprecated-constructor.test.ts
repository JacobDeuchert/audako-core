import { describe, expect, it, vi } from 'vitest';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { DataConnectionBrowserService } from '../../lib/services/data-connection-browser.service.js';
import { DataSourceHttpService } from '../../lib/services/data-source-http.service.js';
import { EntityHttpService } from '../../lib/services/entity-http.service.js';
import { EntityNameService } from '../../lib/services/entity-name.service.js';
import { HistoricalValueManipulationHttpService } from '../../lib/services/historical-value-manipulation-http.service.js';
import { HistoricalValueService } from '../../lib/services/historical-value.service.js';
import { LiveValueService } from '../../lib/services/live-value.service.js';
import { TenantHttpService } from '../../lib/services/tenant-http.service.js';
import { UserProfileHttpService } from '../../lib/services/user-profile-http.service.js';
import { V4_CONFIG } from './api-context-stub.js';

/**
 * The deprecated `(httpConfig, accessToken)` constructor of every service must keep working.
 * `ApiVersion` in the config short-circuits version detection, so nothing is probed - which is
 * also the migration path for apps that cannot reach the version endpoint.
 */
const legacyConfig = { ...V4_CONFIG, ApiVersion: '4.23.0' } as HttpConfig;

/** Spies on the axios instance of the context the service built for itself. */
function spyOnRequests(service: any) {
  const http = service.ctx.http;
  return {
    request: vi.spyOn(http, 'request').mockResolvedValue({ status: 200, data: null, headers: {} } as any),
    get: vi.spyOn(http, 'get').mockResolvedValue({ status: 200, data: null, headers: {} } as any),
    post: vi.spyOn(http, 'post').mockResolvedValue({ status: 200, data: null, headers: {} } as any),
  };
}

describe('deprecated two-argument service constructors', () => {
  it('EntityHttpService resolves a v4 URL', async () => {
    const service = new EntityHttpService(legacyConfig, 'token');
    const { request } = spyOnRequests(service);

    await service.getEntityById(EntityType.Signal, 'abc');

    expect((request.mock.calls[0][0] as any).url).toBe('https://host/api/structure/daq/Signal/abc');
  });

  it('TenantHttpService resolves a v4 URL', async () => {
    const service = new TenantHttpService(legacyConfig, 'token');
    const { request } = spyOnRequests(service);

    await service.getTopTenants();

    expect((request.mock.calls[0][0] as any).url).toBe('https://host/api/structure/tenant/top');
  });

  it('UserProfileHttpService resolves a v4 URL', async () => {
    const service = new UserProfileHttpService(legacyConfig, 'token');
    const { request } = spyOnRequests(service);

    await service.getUserProfile();

    expect((request.mock.calls[0][0] as any).url).toBe('https://host/api/structure/userprofile');
  });

  it('DataSourceHttpService resolves a v4 URL', async () => {
    const service = new DataSourceHttpService(legacyConfig, 'token');
    const { get } = spyOnRequests(service);

    await service.sendDatSrcConfiguration('source-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/driver/command/source/source-1/configure');
  });

  it('DataConnectionBrowserService resolves a v4 URL', async () => {
    const service = new DataConnectionBrowserService(legacyConfig, 'token');
    const { request } = spyOnRequests(service);

    await service.browseConnection('conn-1', '');

    expect((request.mock.calls[0][0] as any).url).toBe('https://host/api/driver/command/conn/conn-1/browse');
  });

  it('HistoricalValueService resolves a v4 URL', async () => {
    const service = new HistoricalValueService(legacyConfig, 'token');
    const { post } = spyOnRequests(service);

    await service.postNoteEntries([]);

    expect(post.mock.calls[0][0]).toBe('https://host/api/historian/value/note');
  });

  it('HistoricalValueManipulationHttpService resolves a v4 URL', async () => {
    const service = new HistoricalValueManipulationHttpService(legacyConfig, 'token');
    const { get } = spyOnRequests(service);

    await service.getHistoricalValueOperations('signal-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/historian/historicalvaluemanipulation/operations/signal-1');
  });

  it('LiveValueService resolves the v4 hub URL', async () => {
    const service = new LiveValueService(legacyConfig, 'token');

    await expect(service.getHubUrl()).resolves.toBe('https://host/api/live/hub');
  });

  it('EntityNameService works on a legacy EntityHttpService', async () => {
    const httpService = new EntityHttpService(legacyConfig, 'token');
    const { request } = spyOnRequests(httpService);
    request.mockResolvedValue({ status: 200, data: { Id: 'g1', Name: { Value: 'Group' } }, headers: {} } as any);

    await expect(new EntityNameService(httpService).resolveName(EntityType.Group, 'g1')).resolves.toBe('Group');
    expect((request.mock.calls[0][0] as any).url).toContain('https://host/api/structure/base/Group/g1');
  });

  it('the deprecated httpConfig accessor still resolves the config', async () => {
    const service: any = new EntityHttpService(legacyConfig, 'token');
    await expect(service.httpConfig()).resolves.toBe(legacyConfig);
  });
});
