import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { CompressionInterval } from '../../lib/models/historical-value.model.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import { V4_CONFIG, V5_CONFIG } from './api-context-stub.js';
import {
  HistoricalValueRequest,
  HistoricalValueService,
  OffsetSource,
} from '../../lib/services/historical-value.service.js';

function createService(version: '4.23.0' | '5.0.0') {
  const ctx = new ApiContext(version.startsWith('4') ? V4_CONFIG : V5_CONFIG, 'token', createApiVersionInfo(version));
  const service = new HistoricalValueService(ctx);
  const post = vi.spyOn(ctx.http, 'post').mockResolvedValue({ status: 200, data: {} } as any);
  const get = vi.spyOn(ctx.http, 'get').mockResolvedValue({ status: 200, data: {} } as any);
  return { ctx, service, post, get };
}

const query: HistoricalValueRequest = {
  ObjectType: EntityType.Signal,
  ObjectId: 'signal-1',
  IntervalType: CompressionInterval.HourInterval,
  MinMaxIntervalType: CompressionInterval.DayInterval,
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
    expect(value.Notes).toEqual([{ Note: 'checked', CreatedBy: 'user-1', Timestamp: '2026-01-01T00:00:00Z' }]);
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

    const value = await service.getNearestValue(query);

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
});
