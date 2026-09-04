import { describe, expect, it, vi } from 'vitest';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import { EntityHttpService } from '../../lib/services/entity-http.service.js';
import { EntityNameService } from '../../lib/services/entity-name.service.js';
import { stubContext } from './api-context-stub.js';

function nameService(platformVersion: string) {
  const stub = stubContext(platformVersion);
  const http = new EntityHttpService(stub.ctx);
  const getEntityInfos = vi.spyOn(http, 'getEntityInfos').mockResolvedValue([]);
  const getPartialEntityById = vi
    .spyOn(http, 'getPartialEntityById')
    .mockImplementation((_type, id) => Promise.resolve({ Name: { Value: `name-${id}` } } as any));

  return { service: new EntityNameService(http), getEntityInfos: getEntityInfos, getPartialEntityById };
}

describe('EntityNameService branch selection', () => {
  it('resolves names with one entity-info request on v5', async () => {
    const stub = nameService('5.0.0');
    stub.getEntityInfos.mockResolvedValue([
      { Id: 'a', Name: { Value: 'Alpha' } as any },
      { Id: 'b', Name: 'Beta' },
    ]);

    await expect(stub.service.resolvePathName(['a', 'b'])).resolves.toBe('Alpha / Beta');
    expect(stub.getEntityInfos).toHaveBeenCalledTimes(1);
    expect(stub.getEntityInfos.mock.calls[0][0]).toBe(EntityType.Group);
    expect(stub.getEntityInfos.mock.calls[0][1]).toMatchObject({ filter: { Id: { $in: ['a', 'b'] } } });
    expect(stub.getPartialEntityById).not.toHaveBeenCalled();
  });

  it('falls back to one projected GET per id on v4', async () => {
    const stub = nameService('4.23.0');

    await expect(stub.service.resolvePathName(['a', 'b'])).resolves.toBe('name-a / name-b');
    expect(stub.getEntityInfos).not.toHaveBeenCalled();
    expect(stub.getPartialEntityById).toHaveBeenCalledTimes(2);
  });

  it('caches resolved names per id', async () => {
    const stub = nameService('4.23.0');

    await stub.service.resolveName(EntityType.Group, 'a');
    await stub.service.resolveName(EntityType.Group, 'a');

    expect(stub.getPartialEntityById).toHaveBeenCalledTimes(1);
  });

  it('falls back to the per-id lookup for ids entity-info did not return', async () => {
    const stub = nameService('5.0.0');
    stub.getEntityInfos.mockResolvedValue([{ Id: 'a', Name: 'Alpha' }]);

    await expect(stub.service.resolvePathName(['a', 'b'])).resolves.toBe('Alpha / name-b');
    expect(stub.getPartialEntityById).toHaveBeenCalledTimes(1);
  });
});
