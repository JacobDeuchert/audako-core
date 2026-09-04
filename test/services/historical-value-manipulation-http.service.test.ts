import { describe, expect, it, vi } from 'vitest';
import { ApiContext } from '../../lib/api/api-context.js';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { HistoricalValueOperationStatus } from '../../lib/models/historical-value-operation.model.js';
import { HttpConfig } from '../../lib/models/http-config.model.js';
import { HistoricalValueManipulationHttpService } from '../../lib/services/historical-value-manipulation-http.service.js';

const v4Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/structure', Historian: '/historian' },
  Authentication: null,
} as unknown as HttpConfig;

const v5Config = {
  Services: { BaseUri: 'https://host/api', Structure: '/v1/structure', Historian: '/v1/historian' },
  Authentication: null,
} as unknown as HttpConfig;

function createService(version: '4.23.0' | '5.0.0') {
  const ctx = new ApiContext(version.startsWith('4') ? v4Config : v5Config, 'token', createApiVersionInfo(version));
  const service = new HistoricalValueManipulationHttpService(ctx);
  return {
    service: service,
    get: vi.spyOn(ctx.http, 'get').mockResolvedValue({ status: 200, data: [] } as any),
    post: vi.spyOn(ctx.http, 'post').mockResolvedValue({ status: 200, data: {} } as any),
    request: vi.spyOn(ctx.http, 'request').mockResolvedValue({ status: 200, data: null } as any),
  };
}

/** v4 response, as captured from a 4.23 system. */
const v4Operation = {
  Id: 'op-1',
  SignalId: 'signal-1',
  From: '2026-01-01T00:00:00Z',
  Till: '2026-01-02T00:00:00Z',
  Timezone: 'CET',
  OperationScript: 'value * 2',
  OperationDescription: 'double',
  Status: 'Processing',
  CreatedOn: '2026-01-03T10:00:00Z',
  CreatedBy: 'user-1',
  ChangedOn: '2026-01-03T10:05:00Z',
  ChangedBy: 'user-2',
};

/** v5 response. */
const v5Operation = {
  Id: 'op-1',
  SignalId: 'signal-1',
  UserId: 'user-1',
  StartedOn: '2026-01-03T10:00:00Z',
  StoppedOn: null,
  Status: 'Pending',
  ErrorMessage: null,
  Progress: 12,
  From: '2026-01-01T00:00:00Z',
  Till: '2026-01-02T00:00:00Z',
  OperationScript: 'value * 2',
  OperationDescription: 'double',
  IsUndoable: false,
  IsRedoable: false,
  LiveOperationId: 'live-op-1',
  Layer: 'Raw',
};

describe('HistoricalValueManipulationHttpService URL resolution', () => {
  it('uses the v4 historicalvaluemanipulation paths and PUT for undo/redo', async () => {
    const { service, get, post, request } = createService('4.23.0');

    await service.getHistoricalValueOperations('signal-1');
    await service.startHistoricalValueOperation('signal-1', new Date(0), new Date(0), 'CET', 'x', 'y');
    await service.undoHistoricalValueOperation('op-1');
    await service.redoHistoricalValueOperation('op-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/historian/historicalvaluemanipulation/operations/signal-1');
    expect(post.mock.calls[0][0]).toBe(
      'https://host/api/historian/historicalvaluemanipulation/operations/signal-1/start',
    );
    expect(request.mock.calls.map((call) => call[0])).toEqual([
      {
        url: 'https://host/api/historian/historicalvaluemanipulation/operations/op-1/undo',
        method: 'PUT',
        data: null,
      },
      {
        url: 'https://host/api/historian/historicalvaluemanipulation/operations/op-1/redo',
        method: 'PUT',
        data: null,
      },
    ]);
  });

  it('uses the v5 historical-value-operations paths and POST for undo/redo', async () => {
    const { service, get, post, request } = createService('5.0.0');

    await service.getHistoricalValueOperations('signal-1');
    await service.startHistoricalValueOperation('signal-1', new Date(0), new Date(0), 'CET', 'x', 'y');
    await service.undoHistoricalValueOperation('op-1');

    expect(get.mock.calls[0][0]).toBe('https://host/api/v1/historian/historical-value-operations/signal-1');
    expect(post.mock.calls[0][0]).toBe('https://host/api/v1/historian/historical-value-operations/signal-1/start');
    expect(request.mock.calls[0][0]).toEqual({
      url: 'https://host/api/v1/historian/historical-value-operations/op-1/undo',
      method: 'POST',
      data: null,
    });
  });

  it('sends the identical start body on both versions', async () => {
    const { service, post } = createService('5.0.0');
    const from = new Date('2026-01-01T00:00:00Z');
    const till = new Date('2026-01-02T00:00:00Z');

    await service.startHistoricalValueOperation('signal-1', from, till, 'CET', 'value * 2', 'double');

    expect(post.mock.calls[0][1]).toEqual({
      From: from,
      Till: till,
      Timezone: 'CET',
      OperationScript: 'value * 2',
      OperationDescription: 'double',
    });
  });
});

describe('HistoricalValueOperation v4 adapter', () => {
  it('maps the v4 audit fields and status onto the canonical shape', async () => {
    const { service, get } = createService('4.23.0');
    get.mockResolvedValue({ status: 200, data: [v4Operation] } as any);

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    // Processing -> Pending (v5 does not distinguish queued from running).
    expect(operation.Status).toBe(HistoricalValueOperationStatus.Pending);
    expect(operation.UserId).toBe('user-1');
    expect(operation.StartedOn).toBe('2026-01-03T10:00:00Z');
    // Still running, so no stop time even though ChangedOn is set.
    expect(operation.StoppedOn).toBeNull();
    expect(operation.IsUndoable).toBe(false);
    expect(operation.IsRedoable).toBe(false);
    // Legacy fields are kept for apps that still read them.
    expect(operation.CreatedBy).toBe('user-1');
    expect(operation.Timezone).toBe('CET');
  });

  it('derives StoppedOn and IsUndoable for a completed v4 operation', async () => {
    const { service, get } = createService('4.23.0');
    get.mockResolvedValue({ status: 200, data: [{ ...v4Operation, Status: 'Completed' }] } as any);

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    expect(operation.Status).toBe(HistoricalValueOperationStatus.Completed);
    expect(operation.StoppedOn).toBe('2026-01-03T10:05:00Z');
    expect(operation.IsUndoable).toBe(true);
    expect(operation.IsRedoable).toBe(false);
  });

  it('maps the v4-only Undone status to Completed + IsRedoable', async () => {
    const { service, get } = createService('4.23.0');
    get.mockResolvedValue({ status: 200, data: [{ ...v4Operation, Status: 'Undone' }] } as any);

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    expect(operation.Status).toBe(HistoricalValueOperationStatus.Completed);
    expect(operation.IsRedoable).toBe(true);
    expect(operation.IsUndoable).toBe(false);
  });

  it('passes v5 payloads through unchanged', async () => {
    const { service, get, post } = createService('5.0.0');
    get.mockResolvedValue({ status: 200, data: [v5Operation] } as any);
    post.mockResolvedValue({ status: 200, data: v5Operation } as any);

    const [operation] = await service.getHistoricalValueOperations('signal-1');
    const started = await service.startHistoricalValueOperation(
      'signal-1',
      new Date(0),
      new Date(0),
      'CET',
      'x',
      'y',
    );

    expect(operation).toEqual(v5Operation);
    expect(started).toEqual(v5Operation);
  });

  it('tolerates a non-array response', async () => {
    const { service, get } = createService('5.0.0');
    get.mockResolvedValue({ status: 200, data: null } as any);

    await expect(service.getHistoricalValueOperations('signal-1')).resolves.toEqual([]);
  });
});
