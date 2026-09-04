import { describe, expect, it } from 'vitest';
import { UnsupportedApiVersionError } from '../../lib/api/errors.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import { Group } from '../../lib/models/entities/group.model.js';
import { EntityHttpService } from '../../lib/services/entity-http.service.js';
import { stubContext } from './api-context-stub.js';

function service(platformVersion: string) {
  const stub = stubContext(platformVersion);
  return { service: new EntityHttpService(stub.ctx), request: stub.request };
}

describe('EntityHttpService.getPartialEntityById', () => {
  it('uses the v4 domain path and the v5 kebab-plural segment', async () => {
    const v4 = service('4.23.0');
    v4.request.mockResolvedValue({ data: { Id: 'abc' }, headers: {} });
    await v4.service.getEntityById(EntityType.Signal, 'abc');
    expect(v4.request.mock.calls[0][0]).toMatchObject({
      method: 'GET',
      url: 'https://host/api/structure/daq/Signal/abc',
    });

    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: { Id: 'abc' }, headers: {} });
    await v5.service.getEntityById(EntityType.Signal, 'abc');
    expect(v5.request.mock.calls[0][0]).toMatchObject({
      method: 'GET',
      url: 'https://host/api/v1/structure/signals/abc',
    });
  });

  it('keeps $projection in the query string on both versions', async () => {
    for (const version of ['4.23.0', '5.0.0']) {
      const stub = service(version);
      stub.request.mockResolvedValue({ data: { Id: 'abc' }, headers: {} });
      await stub.service.getPartialEntityById(EntityType.Group, 'abc', { Name: 1 });
      expect(stub.request.mock.calls[0][0].url).toContain('?$projection={"Name":1}');
    }
  });
});

describe('EntityHttpService.queryConfiguration', () => {
  it('posts to /query with $projection in the body on v4', async () => {
    const { service: svc, request } = service('4.23.0');
    request.mockResolvedValue({ data: [{ Id: 'a' }], headers: {} });

    const result = await svc.queryConfiguration(EntityType.Signal, { GroupId: 'g' }, undefined, { Name: 1 } as any);

    expect(request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'https://host/api/structure/daq/Signal/query',
      data: { $filter: '{"GroupId":"g"}', $paging: null, $projection: '{"Name":1}' },
    });
    expect(result.total).toBe(1);
  });

  it('uses the QUERY verb with $projection in the query string on v5', async () => {
    const { service: svc, request } = service('5.0.0');
    request.mockResolvedValue({ data: [{ Id: 'a' }], headers: {} });

    await svc.queryConfiguration(EntityType.Signal, { GroupId: 'g' }, undefined, { Name: 1 } as any, {
      sort: { 'Name.Value': 1 },
      language: 'de-DE',
    });

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('QUERY');
    expect(config.url).toBe('https://host/api/v1/structure/signals?$projection={"Name":1}');
    expect(config.data).toEqual({ $filter: '{"GroupId":"g"}', $paging: null, $sort: '{"Name.Value":1}' });
    expect(config.headers).toMatchObject({ Language: 'de-DE' });
  });

  it('reads TotalCount from the Paging-Headers response header', async () => {
    const { service: svc, request } = service('5.0.0');
    request.mockResolvedValue({ data: [{ Id: 'a' }], headers: { 'paging-headers': '{"TotalCount":42}' } });

    const result = await svc.queryConfiguration(EntityType.Group, {}, { skip: 0, limit: 1 });

    expect(request.mock.calls[0][0].data.$paging).toBe('{"skip":0,"limit":1}');
    expect(result.total).toBe(42);
  });
});

describe('EntityHttpService.updateEntity', () => {
  function entity(): any {
    const group: any = new Group();
    group.Id = 'g1';
    group.CreatedBy = 'user';
    group.CreatedOn = new Date('2026-01-01T00:00:00Z');
    group.ChangedOn = new Date('2026-02-01T00:00:00Z');
    group.Path = ['root'];
    group.AclAllow = ['x'];
    group.AclDeny = ['y'];
    return group;
  }

  it('strips CreatedBy/CreatedOn on v4 but keeps them and ChangedOn on v5', async () => {
    const v4 = service('4.23.0');
    v4.request.mockResolvedValue({ data: { Id: 'g1' }, headers: {} });
    await v4.service.updateEntity(EntityType.Group, entity());
    const v4Payload = v4.request.mock.calls[0][0].data;
    expect(v4Payload.CreatedBy).toBeUndefined();
    expect(v4Payload.CreatedOn).toBeUndefined();

    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: { Id: 'g1' }, headers: {} });
    await v5.service.updateEntity(EntityType.Group, entity());
    const v5Payload = v5.request.mock.calls[0][0].data;
    expect(v5Payload.CreatedBy).toBe('user');
    expect(v5Payload.CreatedOn).toBeInstanceOf(Date);
    expect(v5Payload.ChangedOn).toBeInstanceOf(Date);
  });

  it('strips the server-owned Path/AclAllow/AclDeny on both versions', async () => {
    for (const version of ['4.23.0', '5.0.0']) {
      const stub = service(version);
      stub.request.mockResolvedValue({ data: { Id: 'g1' }, headers: {} });
      await stub.service.updateEntity(EntityType.Group, entity());
      const payload = stub.request.mock.calls[0][0].data;
      expect(payload.Path).toBeUndefined();
      expect(payload.AclAllow).toBeUndefined();
      expect(payload.AclDeny).toBeUndefined();
    }
  });

  it('never mutates the caller\'s instance', async () => {
    const stub = service('4.23.0');
    stub.request.mockResolvedValue({ data: { Id: 'g1' }, headers: {} });

    const original = entity();
    await stub.service.updateEntity(EntityType.Group, original);

    expect(original.CreatedBy).toBe('user');
    expect(original.CreatedOn).toBeInstanceOf(Date);
    expect(original.Path).toEqual(['root']);
    expect(original.AclAllow).toEqual(['x']);
  });

  it('PUTs to the entity url of the respective version', async () => {
    const v4 = service('4.23.0');
    v4.request.mockResolvedValue({ data: {}, headers: {} });
    await v4.service.updateEntity(EntityType.Group, entity());
    expect(v4.request.mock.calls[0][0]).toMatchObject({
      method: 'PUT',
      url: 'https://host/api/structure/base/Group/g1',
    });

    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: {}, headers: {} });
    await v5.service.updateEntity(EntityType.Group, entity());
    expect(v5.request.mock.calls[0][0]).toMatchObject({
      method: 'PUT',
      url: 'https://host/api/v1/structure/groups/g1',
    });
  });

  it('surfaces 423 Locked as an EntityLockedError', async () => {
    const stub = service('5.0.0');
    stub.request.mockRejectedValue({
      response: { status: 423, data: { title: 'Group.Locked', detail: 'locked subtree' } },
    });

    await expect(stub.service.updateEntity(EntityType.Group, entity())).rejects.toMatchObject({
      name: 'EntityLockedError',
      status: 423,
      title: 'Group.Locked',
    });
  });

  it('surfaces a 400 id mismatch as an ApiError', async () => {
    const stub = service('5.0.0');
    stub.request.mockRejectedValue({
      response: { status: 400, data: { title: 'Group.InvalidRequest', detail: 'Id mismatch' } },
    });

    await expect(stub.service.updateEntity(EntityType.Group, entity())).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      title: 'Group.InvalidRequest',
    });
  });
});

describe('EntityHttpService.copyMultipleTo / moveMultipleTo', () => {
  it('normalizes the v4 text id and the v5 {OperationId} body to a string', async () => {
    const v4 = service('4.23.0');
    v4.request.mockResolvedValue({ data: 'op-1', headers: {} });
    await expect(v4.service.copyMultipleTo(['a'], 'target', EntityType.Group)).resolves.toBe('op-1');
    expect(v4.request.mock.calls[0][0]).toMatchObject({
      method: 'PUT',
      url: 'https://host/api/structure/base/Group/copy/multiple/target',
      data: ['a'],
    });

    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: { OperationId: 'op-2' }, headers: {} });
    await expect(v5.service.moveMultipleTo(['a'], 'target', EntityType.Group)).resolves.toBe('op-2');
    expect(v5.request.mock.calls[0][0].url).toBe('https://host/api/v1/structure/groups/move/multiple/target');
  });

  it('parses a JSON body that arrived as text', async () => {
    const stub = service('5.0.0');
    stub.request.mockResolvedValue({ data: '{"OperationId":"op-3"}', headers: {} });
    await expect(stub.service.copyMultipleTo(['a'], 'target', EntityType.Group)).resolves.toBe('op-3');
  });
});

describe('v5-only entity endpoints', () => {
  it('countEntities resolves on v5 and throws on v4', async () => {
    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: 7, headers: {} });
    await expect(v5.service.countEntities(EntityType.Signal, { GroupId: 'g' })).resolves.toBe(7);
    expect(v5.request.mock.calls[0][0].url).toBe('https://host/api/v1/structure/signals/count?$filter={"GroupId":"g"}');

    const v4 = service('4.23.0');
    await expect(v4.service.countEntities(EntityType.Signal)).rejects.toBeInstanceOf(UnsupportedApiVersionError);
    expect(v4.request).not.toHaveBeenCalled();
  });

  it('getEntityInfos resolves on v5 and throws on v4', async () => {
    const v5 = service('5.0.0');
    v5.request.mockResolvedValue({ data: [{ Id: 'a', Name: { Value: 'A' } }], headers: {} });
    await v5.service.getEntityInfosByIds(EntityType.Group, ['a', 'b']);
    expect(v5.request.mock.calls[0][0].url).toBe(
      'https://host/api/v1/structure/groups/entity-info?$filter={"Id":{"$in":["a","b"]}}',
    );

    const v4 = service('4.23.0');
    await expect(v4.service.getEntityInfos(EntityType.Group)).rejects.toBeInstanceOf(UnsupportedApiVersionError);
  });
});
