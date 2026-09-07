import { describe, expect, it } from 'vitest';
import { CompressionInterval } from '../../lib/models/historical-value.model.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import {
  HistoricalValueRequest,
  HistoricalValueService,
  OffsetSource,
} from '../../lib/services/historical-value.service.js';
import { stubContext } from './api-context-stub.js';

function createService(version: '4.23.0' | '5.0.0') {
  const stub = stubContext(version);
  stub.request.mockResolvedValue({ status: 200, data: {}, headers: {} });
  return { service: new HistoricalValueService(stub.ctx), request: stub.request };
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
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({ status: 200, data: [], headers: {} });

    await service.queryValuesFlat([query]);
    await service.queryValues([query]);
    await service.addNotes([]);
    await service.importValues([]);
    await service.getCounterOffsets('signal-1');

    expect(request.mock.calls.map((call) => [call[0].method, call[0].url])).toEqual([
      ['POST', 'https://host/api/historian/value/manyflat'],
      ['POST', 'https://host/api/historian/value/many'],
      ['POST', 'https://host/api/historian/value/note'],
      ['POST', 'https://host/api/historian/historicalvalueimport/import'],
      ['GET', 'https://host/api/historian/value/counter/signal-1/offsets'],
    ]);
  });

  it('uses the v5 historical-values paths', async () => {
    const { service, request } = createService('5.0.0');
    request.mockResolvedValue({ status: 200, data: [], headers: {} });

    await service.queryValuesFlat([query]);
    await service.queryValues([query]);
    await service.addNotes([]);
    await service.importValues([]);
    await service.getCounterOffsets('signal-1', new Date('2026-01-01T00:00:00Z'));

    expect(request.mock.calls.map((call) => call[0].url)).toEqual([
      'https://host/api/v1/historian/historical-values/query-many-flat',
      'https://host/api/v1/historian/historical-values/query-many',
      'https://host/api/v1/historian/historical-values/notes',
      'https://host/api/v1/historian/historical-value-imports',
      'https://host/api/v1/historian/historical-values/counters/signal-1/offsets',
    ]);
    // Range bounds go through axios params, never string-concatenated into the URL.
    expect(request.mock.calls[4][0].params).toEqual({ $from: '2026-01-01T00:00:00.000Z', $till: undefined });
  });

  it('sends the reset options as the PascalCase body', async () => {
    const { service, request } = createService('5.0.0');
    const from = new Date('2026-01-01T00:00:00Z');

    await service.resetStatistics('signal-1', { from: from, resetOffsets: true });

    expect(request.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      url: 'https://host/api/v1/historian/historical-values/statistics/signal-1/reset',
      data: { From: from.toISOString(), Till: null, ResetOffsets: true, ResetCustomOffsets: false },
    });
  });

  it('surfaces failures as ApiError', async () => {
    const { service, request } = createService('5.0.0');
    request.mockRejectedValue({ response: { status: 500, data: '' } });

    await expect(service.queryValuesFlat([query])).rejects.toMatchObject({ name: 'ApiError', status: 500 });
  });
});

describe('getNearestValue normalization', () => {
  it('lifts the flat v4 note into Notes', async () => {
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({
      status: 200,
      data: { IntervalStart: '2026-01-01T00:00:00Z', Value: 42, Note: 'checked', CreatedBy: 'user-1' },
      headers: {},
    });

    const value = await service.getNearestValue(query);

    expect(request.mock.calls[0][0].url).toBe('https://host/api/historian/value/nearest');
    expect(value.Value).toBe(42);
    expect(value.Notes).toEqual([{ Note: 'checked', CreatedBy: 'user-1', Timestamp: '2026-01-01T00:00:00Z' }]);
  });

  it('passes a v5 MeasuredValue through', async () => {
    const { service, request } = createService('5.0.0');
    const measuredValue = {
      IntervalStart: '2026-01-01T00:00:00Z',
      Value: 42,
      MinValue: 40,
      MaxValue: 44,
      Notes: [{ Note: 'checked', CreatedBy: 'user-1', Timestamp: '2026-01-01T01:00:00Z' }],
    };
    request.mockResolvedValue({ status: 200, data: measuredValue, headers: {} });

    const value = await service.getNearestValue(query);

    expect(request.mock.calls[0][0].url).toBe('https://host/api/v1/historian/historical-values/nearest');
    expect(value).toEqual(measuredValue);
  });

  it('normalizes packaged v4 values the same way', async () => {
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({
      status: 200,
      data: [
        {
          ObjectType: 'Signal',
          ObjectId: 'signal-1',
          IntervalType: 'HourInterval',
          Values: [{ IntervalStart: '2026-01-01T00:00:00Z', Value: 1, Note: 'n', CreatedBy: 'u' }],
        },
      ],
      headers: {},
    });

    const [valuePackage] = await service.queryValues([query]);

    expect(valuePackage.ObjectId).toBe('signal-1');
    expect(valuePackage.Values[0].Notes).toEqual([{ Note: 'n', CreatedBy: 'u', Timestamp: '2026-01-01T00:00:00Z' }]);
  });
});

describe('setCustomOffset body casing', () => {
  const canonical = {
    Timestamp: '2026-01-01T00:00:00Z',
    Value: 12.5,
    Note: 'meter swap',
    Source: OffsetSource.CounterReplacement,
  };

  it('sends camelCase to v4', async () => {
    const { service, request } = createService('4.23.0');

    await service.setCustomOffset('signal-1', canonical);

    expect(request.mock.calls[0][0].url).toBe('https://host/api/historian/value/counter/signal-1/offsets/custom');
    expect(request.mock.calls[0][0].data).toEqual({
      timestamp: '2026-01-01T00:00:00Z',
      value: 12.5,
      note: 'meter swap',
      source: OffsetSource.CounterReplacement,
    });
  });

  it('sends PascalCase to v5', async () => {
    const { service, request } = createService('5.0.0');

    await service.setCustomOffset('signal-1', canonical);

    expect(request.mock.calls[0][0].url).toBe(
      'https://host/api/v1/historian/historical-values/counters/signal-1/offsets/custom',
    );
    expect(request.mock.calls[0][0].data).toEqual(canonical);
  });
});
