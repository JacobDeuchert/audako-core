import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { CompressionInterval } from '../../lib/models/historical-value.model.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import {
  HistoricalValueRequest,
  HistoricalValueService,
  OffsetSource,
} from '../../lib/services/historical-value.service.js';

const v4Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/structure', Historian: '/historian', Live: '/live' },
  Authentication: null,
} as unknown as HttpConfig;

const v5Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/v1/structure', Historian: '/v1/historian', Live: '/live' },
  Authentication: null,
} as unknown as HttpConfig;

function createService(version: '4.23.0' | '5.0.0') {
  const ctx = new ApiContext(
    version.startsWith('4') ? v4Config : v5Config,
    'token',
    createApiVersionInfo(version),
  );
  const service = new HistoricalValueService(ctx);
  const post = vi.spyOn(ctx.http, 'post').mockResolvedValue({ status: 200, data: {} } as any);
  const get = vi.spyOn(ctx.http, 'get').mockResolvedValue({ status: 200, data: {} } as any);
  return { ctx, service, post, get };
}

const query: HistoricalValueRequest = {
  ObjectType: EntityType.Signal,
  ObjectId: 'signal-1',
  IntervalType: CompressionInterval.HourInterval,
  MinMaxInterval: CompressionInterval.DayInterval,
  From: '2026-01-01T00:00:00Z',
  Till: '2026-01-02T00:00:00Z',
  Timezone: 'CET',
  ConvertBackToUtc: true,
};

describe('HistoricalValueService URL resolution', () => {
  it('uses the v4 value paths', async () => {
    const { service, post, get } = createService('4.23.0');
    post.mockResolvedValue({ status: 200, data: [] } as any);
    get.mockResolvedValue({ status: 200, data: {} } as any);

    await service.requestHistoricalValues([query]);
    await service.getHistoricalValueObjects([query]);
    await service.postNoteEntries([]);
    await service.importHistoricalValues([]);
    await service.getCounterOffsets('signal-1');

    expect(post.mock.calls.map((call) => call[0])).toEqual([
      'https://host/api/historian/value/manyflat',
      'https://host/api/historian/value/many',
      'https://host/api/historian/value/note',
      'https://host/api/historian/historicalvalueimport/import',
    ]);
    expect(get.mock.calls[0][0]).toBe('https://host/api/historian/value/counter/signal-1/offsets');
  });

  it('uses the v5 historical-values paths', async () => {
    const { service, post, get } = createService('5.0.0');
    post.mockResolvedValue({ status: 200, data: [] } as any);
    get.mockResolvedValue({ status: 200, data: {} } as any);

    await service.requestHistoricalValues([query]);
    await service.getHistoricalValueObjects([query]);
    await service.postNoteEntries([]);
    await service.importHistoricalValues([]);
    await service.getCounterOffsets('signal-1', new Date('2026-01-01T00:00:00Z'));

    expect(post.mock.calls.map((call) => call[0])).toEqual([
      'https://host/api/v1/historian/historical-values/query-many-flat',
      'https://host/api/v1/historian/historical-values/query-many',
      'https://host/api/v1/historian/historical-values/notes',
      'https://host/api/v1/historian/historical-value-imports',
    ]);
    expect(get.mock.calls[0][0]).toBe(
      'https://host/api/v1/historian/historical-values/counters/signal-1/offsets?$from=2026-01-01T00:00:00.000Z',
    );
  });
});

describe('MinMaxInterval handling', () => {
  it('keeps MinMaxInterval on v4', async () => {
    const { service, post } = createService('4.23.0');
    post.mockResolvedValue({ status: 200, data: [] } as any);

    await service.requestHistoricalValues([query]);

    expect(post.mock.calls[0][1]).toEqual([query]);
  });

  it('strips MinMaxInterval on v5 and promotes it to MinMaxIntervalType', async () => {
    const { service, post } = createService('5.0.0');
    post.mockResolvedValue({ status: 200, data: [] } as any);

    await service.requestHistoricalValues([query]);

    const body = (post.mock.calls[0][1] as any[])[0];
    expect(body.MinMaxInterval).toBeUndefined();
    expect(body.MinMaxIntervalType).toBe(CompressionInterval.DayInterval);
    // The caller's object is not mutated.
    expect(query.MinMaxInterval).toBe(CompressionInterval.DayInterval);
  });

  it('does not overwrite an explicit MinMaxIntervalType on v5', async () => {
    const { service, post } = createService('5.0.0');
    post.mockResolvedValue({ status: 200, data: [] } as any);

    await service.requestHistoricalValues([{ ...query, MinMaxIntervalType: CompressionInterval.WeekInterval }]);

    const body = (post.mock.calls[0][1] as any[])[0];
    expect(body.MinMaxIntervalType).toBe(CompressionInterval.WeekInterval);
    expect(body.MinMaxInterval).toBeUndefined();
  });
});

describe('getNearestValue normalization', () => {
  it('lifts the flat v4 note into Notes', async () => {
    const { service, post } = createService('4.23.0');
    post.mockResolvedValue({
      status: 200,
      data: { IntervalStart: '2026-01-01T00:00:00Z', Value: 42, Note: 'checked', CreatedBy: 'user-1' },
    } as any);

    const value = await service.getNearestValue(query);

    expect(post.mock.calls[0][0]).toBe('https://host/api/historian/value/nearest');
    expect(value.Value).toBe(42);
    expect(value.Notes).toEqual([
      { Note: 'checked', CreatedBy: 'user-1', Timestamp: '2026-01-01T00:00:00Z' },
    ]);
  });

  it('passes a v5 MeasuredValue through', async () => {
    const { service, post } = createService('5.0.0');
    const measuredValue = {
      IntervalStart: '2026-01-01T00:00:00Z',
      Value: 42,
      MinValue: 40,
      MaxValue: 44,
      Notes: [{ Note: 'checked', CreatedBy: 'user-1', Timestamp: '2026-01-01T01:00:00Z' }],
    };
    post.mockResolvedValue({ status: 200, data: measuredValue } as any);

    const value = await service.getNearesValue(query);

    expect(post.mock.calls[0][0]).toBe('https://host/api/v1/historian/historical-values/nearest');
    expect(value).toEqual(measuredValue);
  });
});

describe('setCustomOffset body casing', () => {
  const canonical = {
    Timestamp: '2026-01-01T00:00:00Z',
    Value: 12.5,
    Note: 'meter swap',
    Source: OffsetSource.CounterReplacement,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends camelCase to v4', async () => {
    const { service, post } = createService('4.23.0');

    await service.setCustomOffset('signal-1', canonical);

    expect(post.mock.calls[0][0]).toBe('https://host/api/historian/value/counter/signal-1/offsets/custom');
    expect(post.mock.calls[0][1]).toEqual({
      timestamp: '2026-01-01T00:00:00Z',
      value: 12.5,
      note: 'meter swap',
      source: OffsetSource.CounterReplacement,
    });
  });

  it('sends PascalCase to v5', async () => {
    const { service, post } = createService('5.0.0');

    await service.setCustomOffset('signal-1', canonical);

    expect(post.mock.calls[0][0]).toBe(
      'https://host/api/v1/historian/historical-values/counters/signal-1/offsets/custom',
    );
    expect(post.mock.calls[0][1]).toEqual(canonical);
  });

  it('accepts the deprecated camelCase request shape', async () => {
    const { service, post } = createService('5.0.0');

    await service.setCustomOffset('signal-1', {
      timestamp: '2026-01-01T00:00:00Z',
      value: 12.5,
      source: OffsetSource.Manual,
    });

    expect(post.mock.calls[0][1]).toEqual({
      Timestamp: '2026-01-01T00:00:00Z',
      Value: 12.5,
      Note: null,
      Source: OffsetSource.Manual,
    });
  });
});

describe('deprecated constructor', () => {
  it('still accepts (httpConfig, accessToken)', async () => {
    const service = new HistoricalValueService(v4Config, 'token');
    const ctx = (service as any).ctx as ApiContext;

    expect(ctx).toBeInstanceOf(ApiContext);
    await expect(ctx.getHttpConfig()).resolves.toBe(v4Config);
    await expect(ctx.getAccessToken()).resolves.toBe('token');
  });
});
