import { describe, expect, it } from 'vitest';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { Endpoint, getServiceUrls, resolveEndpoint } from '../../lib/compat/endpoints/endpoint-resolver.js';
import { QUERY_METHOD, V5_ENTITY_SEGMENTS } from '../../lib/compat/endpoints/endpoints.v5.js';
import { UnsupportedApiVersionError } from '../../lib/api/errors.js';

const v4Config = {
  Services: {
    BaseUri: 'https://host/api',
    Structure: '/structure',
    Historian: '/historian',
    Driver: '/driver',
    Live: '/live',
  },
  Authentication: null,
} as unknown as HttpConfig;

const v5Config = {
  Services: {
    BaseUri: 'https://host/api',
    Structure: '/v1/structure',
    Historian: '/v1/historian',
    Driver: '/v1/driver',
    Live: '/live',
  },
  Authentication: null,
} as unknown as HttpConfig;

const v4 = (endpoint: Endpoint) => resolveEndpoint(v4Config, 'V4', endpoint);
const v5 = (endpoint: Endpoint) => resolveEndpoint(v5Config, 'V5', endpoint);

describe('getServiceUrls', () => {
  it('concatenates BaseUri with the per-service path', () => {
    expect(getServiceUrls(v5Config)).toEqual({
      base: 'https://host/api',
      structure: 'https://host/api/v1/structure',
      historian: 'https://host/api/v1/historian',
      driver: 'https://host/api/v1/driver',
      live: 'https://host/api/live',
    });
  });

  it('tolerates a missing Services block', () => {
    expect(getServiceUrls({ Services: null, Authentication: null }).structure).toBe('');
  });
});

describe('entity endpoints', () => {
  it('uses the v4 domain-prefixed path and the v5 kebab-plural segment', () => {
    const endpoint: Endpoint = { name: 'entityById', entityType: EntityType.Signal, id: 'abc' };
    expect(v4(endpoint)).toEqual({
      url: 'https://host/api/structure/daq/Signal/abc',
      method: 'GET',
    });
    expect(v5(endpoint)).toEqual({
      url: 'https://host/api/v1/structure/signals/abc',
      method: 'GET',
    });
  });

  it('maps every entity type to a v5 segment', () => {
    for (const entityType of Object.values(EntityType)) {
      expect(V5_ENTITY_SEGMENTS[entityType], entityType).toBeTruthy();
      expect(v5({ name: 'entityCollection', entityType }).url).toBe(
        `https://host/api/v1/structure/${V5_ENTITY_SEGMENTS[entityType]}`,
      );
    }
  });

  it('has a unique v5 segment per entity type', () => {
    const segments = Object.values(V5_ENTITY_SEGMENTS);
    expect(new Set(segments).size).toBe(segments.length);
  });

  it('does not know Storage any more', () => {
    expect((EntityType as any).Storage).toBeUndefined();
  });

  it('turns the query POST into the QUERY verb on the collection root', () => {
    const endpoint: Endpoint = { name: 'entityQuery', entityType: EntityType.Group };
    expect(v4(endpoint)).toEqual({
      url: 'https://host/api/structure/base/Group/query',
      method: 'POST',
    });
    expect(v5(endpoint)).toEqual({
      url: 'https://host/api/v1/structure/groups',
      method: QUERY_METHOD,
    });
  });

  it('repoints the alarming/maintenance/runtime entities that have no legacy rewrite', () => {
    expect(v5({ name: 'entityCollection', entityType: EntityType.Recipient }).url).toBe(
      'https://host/api/v1/structure/recipients',
    );
    expect(v5({ name: 'entityCollection', entityType: EntityType.RuntimeScript }).url).toBe(
      'https://host/api/v1/structure/runtime-scripts',
    );
    expect(v5({ name: 'entityCollection', entityType: EntityType.MaintenanceService }).url).toBe(
      'https://host/api/v1/structure/maintenance-services',
    );
  });

  it('resolves copy and move for single and multiple entities', () => {
    expect(v4({ name: 'entityCopy', entityType: EntityType.Group, sourceId: 's', targetId: 't' })).toEqual({
      url: 'https://host/api/structure/base/Group/copy/s/to/t',
      method: 'GET',
    });
    expect(v5({ name: 'entityMove', entityType: EntityType.Group, sourceId: 's', targetId: 't' })).toEqual({
      url: 'https://host/api/v1/structure/groups/move/s/to/t',
      method: 'GET',
    });
    expect(v5({ name: 'entityCopyMultiple', entityType: EntityType.Group, targetId: 't' })).toEqual({
      url: 'https://host/api/v1/structure/groups/copy/multiple/t',
      method: 'PUT',
    });
    expect(v4({ name: 'entityMoveMultiple', entityType: EntityType.Group, targetId: 't' })).toEqual({
      url: 'https://host/api/structure/base/Group/move/multiple/t',
      method: 'PUT',
    });
  });

  it('drops the /file segment from the process image upload on v5', () => {
    expect(v4({ name: 'processImageUpload', id: 'p1' }).url).toBe(
      'https://host/api/structure/scada/ProcessImage/p1/file/image',
    );
    expect(v5({ name: 'processImageUpload', id: 'p1' })).toEqual({
      url: 'https://host/api/v1/structure/process-images/p1/image',
      method: 'POST',
    });
  });

  it('exposes count and entity-info on v5 only', () => {
    expect(v5({ name: 'entityCount', entityType: EntityType.Signal }).url).toBe(
      'https://host/api/v1/structure/signals/count',
    );
    expect(v5({ name: 'entityInfo', entityType: EntityType.Signal }).url).toBe(
      'https://host/api/v1/structure/signals/entity-info',
    );
    expect(() => v4({ name: 'entityCount', entityType: EntityType.Signal })).toThrow(UnsupportedApiVersionError);
    expect(() => v4({ name: 'entityInfo', entityType: EntityType.Signal })).toThrow(UnsupportedApiVersionError);
  });
});

describe('structure endpoints', () => {
  it('resolves the version endpoint from the per-service path', () => {
    expect(v4({ name: 'version' }).url).toBe('https://host/api/structure/about/version');
    expect(v5({ name: 'version' }).url).toBe('https://host/api/v1/structure/about/version');
  });

  it('pluralizes the tenant routes on v5', () => {
    expect(v4({ name: 'tenantViewById', tenantId: 't1' }).url).toBe('https://host/api/structure/tenant/t1/view');
    expect(v5({ name: 'tenantViewById', tenantId: 't1' }).url).toBe('https://host/api/v1/structure/tenants/t1/view');
    expect(v4({ name: 'tenantViewForEntity', entityId: 'e1' }).url).toBe(
      'https://host/api/structure/tenant/entity/e1/view',
    );
    expect(v5({ name: 'tenantViewForEntity', entityId: 'e1' }).url).toBe(
      'https://host/api/v1/structure/tenants/entities/e1/view',
    );
    expect(v5({ name: 'tenantsTop' }).url).toBe('https://host/api/v1/structure/tenants/top');
    expect(v5({ name: 'tenantsNext', tenantId: 't1' }).url).toBe('https://host/api/v1/structure/tenants/t1/next');
    expect(v5({ name: 'tenantsFilter', filter: 'abc' }).url).toBe('https://host/api/v1/structure/tenants/filter/abc');
  });

  it('renames userprofile to user-profile on v5', () => {
    expect(v4({ name: 'userProfile' }).url).toBe('https://host/api/structure/userprofile');
    expect(v5({ name: 'userProfile' }).url).toBe('https://host/api/v1/structure/user-profile');
  });
});

describe('historian endpoints', () => {
  it('moves the value endpoints under historical-values', () => {
    expect(v4({ name: 'historicalValuesQueryManyFlat' })).toEqual({
      url: 'https://host/api/historian/value/manyflat',
      method: 'POST',
    });
    expect(v5({ name: 'historicalValuesQueryManyFlat' })).toEqual({
      url: 'https://host/api/v1/historian/historical-values/query-many-flat',
      method: 'POST',
    });
    expect(v5({ name: 'historicalValuesQueryMany' }).url).toBe(
      'https://host/api/v1/historian/historical-values/query-many',
    );
    expect(v5({ name: 'historicalValuesNearest' }).url).toBe('https://host/api/v1/historian/historical-values/nearest');
    expect(v5({ name: 'historicalValuesNth' }).url).toBe('https://host/api/v1/historian/historical-values/nth');
    expect(v5({ name: 'historicalValuesManual' }).url).toBe('https://host/api/v1/historian/historical-values/manual');
  });

  it('pluralizes the note endpoint on v5', () => {
    expect(v4({ name: 'historicalValuesNotes' }).url).toBe('https://host/api/historian/value/note');
    expect(v5({ name: 'historicalValuesNotes' }).url).toBe('https://host/api/v1/historian/historical-values/notes');
  });

  it('resolves the counter offset family', () => {
    expect(v4({ name: 'counterOffsets', signalId: 's1' }).url).toBe(
      'https://host/api/historian/value/counter/s1/offsets',
    );
    expect(v5({ name: 'counterOffsets', signalId: 's1' })).toEqual({
      url: 'https://host/api/v1/historian/historical-values/counters/s1/offsets',
      method: 'GET',
    });
    expect(v5({ name: 'counterOffsetsCustom', signalId: 's1' }).url).toBe(
      'https://host/api/v1/historian/historical-values/counters/s1/offsets/custom',
    );
    expect(v5({ name: 'counterOffsetsRemove', signalId: 's1' }).url).toBe(
      'https://host/api/v1/historian/historical-values/counters/s1/offsets/remove',
    );
    expect(v5({ name: 'counterOffsetsCustomRemove', signalId: 's1' }).url).toBe(
      'https://host/api/v1/historian/historical-values/counters/s1/offsets/custom/remove',
    );
  });

  it('resolves the statistics reset and value import endpoints', () => {
    expect(v5({ name: 'statisticsReset', signalId: 's1' }).url).toBe(
      'https://host/api/v1/historian/historical-values/statistics/s1/reset',
    );
    expect(v4({ name: 'historicalValueImport' }).url).toBe('https://host/api/historian/historicalvalueimport/import');
    expect(v5({ name: 'historicalValueImport' })).toEqual({
      url: 'https://host/api/v1/historian/historical-value-imports',
      method: 'POST',
    });
  });

  it('resolves the historical value operations and switches undo/redo to POST on v5', () => {
    expect(v4({ name: 'historicalValueOperations', signalId: 's1' }).url).toBe(
      'https://host/api/historian/historicalvaluemanipulation/operations/s1',
    );
    expect(v5({ name: 'historicalValueOperations', signalId: 's1' }).url).toBe(
      'https://host/api/v1/historian/historical-value-operations/s1',
    );
    expect(v5({ name: 'historicalValueOperationStart', signalId: 's1' })).toEqual({
      url: 'https://host/api/v1/historian/historical-value-operations/s1/start',
      method: 'POST',
    });
    expect(v4({ name: 'historicalValueOperationUndo', operationId: 'o1' })).toEqual({
      url: 'https://host/api/historian/historicalvaluemanipulation/operations/o1/undo',
      method: 'PUT',
    });
    expect(v5({ name: 'historicalValueOperationUndo', operationId: 'o1' })).toEqual({
      url: 'https://host/api/v1/historian/historical-value-operations/o1/undo',
      method: 'POST',
    });
    expect(v5({ name: 'historicalValueOperationRedo', operationId: 'o1' }).method).toBe('POST');
  });
});

describe('driver and live endpoints', () => {
  it('keeps the driver command paths and only changes the service prefix', () => {
    expect(v4({ name: 'driverConfigureDataSource', dataSourceId: 'd1' })).toEqual({
      url: 'https://host/api/driver/command/source/d1/configure',
      method: 'GET',
    });
    expect(v5({ name: 'driverConfigureDataSource', dataSourceId: 'd1' }).url).toBe(
      'https://host/api/v1/driver/command/source/d1/configure',
    );
    expect(v5({ name: 'driverBrowseConnection', dataConnectionId: 'c1' })).toEqual({
      url: 'https://host/api/v1/driver/command/conn/c1/browse',
      method: 'POST',
    });
  });

  it('renames the live hub segment from hub to values', () => {
    expect(v4({ name: 'liveHub' })).toEqual({ url: 'https://host/api/live/hub', method: 'HUB' });
    expect(v5({ name: 'liveHub' })).toEqual({
      url: 'https://host/api/live/values',
      method: 'HUB',
    });
  });
});
