import { describe, expect, it } from 'vitest';
import { HistoricalValueOperationStatus } from '../../lib/models/historical-value-operation.model.js';
import { HistoricalValueManipulationHttpService } from '../../lib/services/historical-value-manipulation-http.service.js';
import { stubContext } from './api-context-stub.js';

function createService(version: '4.23.0' | '5.0.0') {
  const stub = stubContext(version);
  stub.request.mockResolvedValue({ status: 200, data: null, headers: {} });
  return { service: new HistoricalValueManipulationHttpService(stub.ctx), request: stub.request };
}

const startRequest = {
  From: new Date('2026-01-01T00:00:00Z'),
  Till: new Date('2026-01-02T00:00:00Z'),
  Timezone: 'CET',
  OperationScript: 'value * 2',
  OperationDescription: 'double',
};

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
    const { service, request } = createService('4.23.0');

    await service.getHistoricalValueOperations('signal-1');
    await service.startHistoricalValueOperation('signal-1', startRequest);
    await service.undoHistoricalValueOperation('op-1');
    await service.redoHistoricalValueOperation('op-1');

    expect(request.mock.calls.map((call) => [call[0].method, call[0].url])).toEqual([
      ['GET', 'https://host/api/historian/historicalvaluemanipulation/operations/signal-1'],
      ['POST', 'https://host/api/historian/historicalvaluemanipulation/operations/signal-1/start'],
      ['PUT', 'https://host/api/historian/historicalvaluemanipulation/operations/op-1/undo'],
      ['PUT', 'https://host/api/historian/historicalvaluemanipulation/operations/op-1/redo'],
    ]);
  });

  it('uses the v5 historical-value-operations paths and POST for undo/redo', async () => {
    const { service, request } = createService('5.0.0');

    await service.getHistoricalValueOperations('signal-1');
    await service.startHistoricalValueOperation('signal-1', startRequest);
    await service.undoHistoricalValueOperation('op-1');

    expect(request.mock.calls.map((call) => [call[0].method, call[0].url])).toEqual([
      ['GET', 'https://host/api/v1/historian/historical-value-operations/signal-1'],
      ['POST', 'https://host/api/v1/historian/historical-value-operations/signal-1/start'],
      ['POST', 'https://host/api/v1/historian/historical-value-operations/op-1/undo'],
    ]);
  });

  it('sends the start request as the body unchanged on both versions', async () => {
    for (const version of ['4.23.0', '5.0.0'] as const) {
      const { service, request } = createService(version);
      await service.startHistoricalValueOperation('signal-1', startRequest);
      expect(request.mock.calls[0][0].data).toEqual(startRequest);
    }
  });
});

describe('HistoricalValueOperation v4 adapter', () => {
  it('maps the v4 audit fields and status onto the canonical shape', async () => {
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({ status: 200, data: [v4Operation], headers: {} });

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    // Processing -> Pending (v5 does not distinguish queued from running).
    expect(operation.Status).toBe(HistoricalValueOperationStatus.Pending);
    expect(operation.UserId).toBe('user-1');
    expect(operation.StartedOn).toBe('2026-01-03T10:00:00Z');
    // Still running, so no stop time even though ChangedOn is set.
    expect(operation.StoppedOn).toBeNull();
    expect(operation.IsUndoable).toBe(false);
    expect(operation.IsRedoable).toBe(false);
    // The v4-only wire keys are dropped: the canonical shape is all callers see.
    expect((operation as any).CreatedBy).toBeUndefined();
    expect((operation as any).Timezone).toBeUndefined();
  });

  it('derives StoppedOn and IsUndoable for a completed v4 operation', async () => {
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({ status: 200, data: [{ ...v4Operation, Status: 'Completed' }], headers: {} });

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    expect(operation.Status).toBe(HistoricalValueOperationStatus.Completed);
    expect(operation.StoppedOn).toBe('2026-01-03T10:05:00Z');
    expect(operation.IsUndoable).toBe(true);
    expect(operation.IsRedoable).toBe(false);
  });

  it('maps the v4-only Undone status to Completed + IsRedoable', async () => {
    const { service, request } = createService('4.23.0');
    request.mockResolvedValue({ status: 200, data: [{ ...v4Operation, Status: 'Undone' }], headers: {} });

    const [operation] = await service.getHistoricalValueOperations('signal-1');

    expect(operation.Status).toBe(HistoricalValueOperationStatus.Completed);
    expect(operation.IsRedoable).toBe(true);
    expect(operation.IsUndoable).toBe(false);
  });

  it('passes v5 payloads through unchanged', async () => {
    const { service, request } = createService('5.0.0');
    request.mockResolvedValueOnce({ status: 200, data: [v5Operation], headers: {} });
    request.mockResolvedValueOnce({ status: 200, data: v5Operation, headers: {} });

    const [operation] = await service.getHistoricalValueOperations('signal-1');
    const started = await service.startHistoricalValueOperation('signal-1', startRequest);

    expect(operation).toEqual(v5Operation);
    expect(started).toEqual(v5Operation);
  });

  it('tolerates a non-array response', async () => {
    const { service, request } = createService('5.0.0');
    request.mockResolvedValue({ status: 200, data: null, headers: {} });

    await expect(service.getHistoricalValueOperations('signal-1')).resolves.toEqual([]);
  });
});
