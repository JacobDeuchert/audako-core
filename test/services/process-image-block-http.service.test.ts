import { describe, expect, it } from 'vitest';
import { EndpointNotAvailableError } from '../../lib/api/errors.js';
import { ProcessImageBlockHttpService } from '../../lib/services/process-image-block-http.service.js';
import { stubContext } from './api-context-stub.js';

function createService(version: '4.23.0' | '5.0.0' = '5.0.0') {
  const { ctx, request } = stubContext(version);
  return { service: new ProcessImageBlockHttpService(ctx), request: request };
}

describe('ProcessImageBlockHttpService', () => {
  it('lists the blocks of a tenant', async () => {
    const { service, request } = createService();

    await service.getBlocks('tenant-1');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks');
    expect(config.params).toEqual({ tenantId: 'tenant-1' });
  });

  it('reads the uploaded image as text', async () => {
    const { service, request } = createService();
    request.mockResolvedValue({ status: 200, data: '<svg/>', headers: {} });

    await expect(service.getImage('b1')).resolves.toBe('<svg/>');

    const config = request.mock.calls[0][0];
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/b1/image');
    expect(config.responseType).toBe('text');
  });

  it('reads a single preview as text', async () => {
    const { service, request } = createService();
    request.mockResolvedValue({ status: 200, data: '<svg/>', headers: {} });

    await expect(service.getPreview('b1')).resolves.toBe('<svg/>');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/b1/preview');
    expect(config.responseType).toBe('text');
  });

  it('reads the preview of a given revision', async () => {
    const { service, request } = createService();

    await service.getPreview('b1', 2);

    expect(request.mock.calls[0][0].params).toEqual({ revision: 2 });
  });

  it('requests the previews of several blocks and revisions at once', async () => {
    const { service, request } = createService();

    await service.getPreviews([{ BlockId: 'b1' }, { BlockId: 'b2', Revision: 3 }]);

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('POST');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/previews');
    expect(config.data).toEqual({ Blocks: [{ BlockId: 'b1' }, { BlockId: 'b2', Revision: 3 }] });
  });

  it('reads one revision', async () => {
    const { service, request } = createService();

    await service.getRevision('b1', 2);

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/b1/revisions/2');
  });

  it('materializes an instance with its parameter values', async () => {
    const { service, request } = createService();

    await service.materialize('b1', 'pump1', { Color: '#c62828' });

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('POST');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/b1/materializations');
    expect(config.data).toEqual({ InstanceId: 'pump1', Params: { Color: '#c62828' } });
  });

  it('materializes an instance from its revision', async () => {
    const { service, request } = createService();

    await service.materialize('b1', 'pump1', {}, 2);

    expect(request.mock.calls[0][0].data).toEqual({ InstanceId: 'pump1', Params: {}, Revision: 2 });
  });

  it('creates a block from an SVG file and a name', async () => {
    const { service, request } = createService();

    await service.createBlock('tenant-1', '<svg/>', 'Pump');

    const config = request.mock.calls[0][0];
    const data = config.data as FormData;
    const file = data.get('file') as File;
    expect(config.method).toBe('POST');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks');
    expect(config.params).toEqual({ tenantId: 'tenant-1' });
    expect(data.get('name')).toBe('Pump');
    expect(file.name).toBe('Pump.svg');
    expect(file.type).toBe('image/svg+xml');
  });

  it('uploads a revision as an SVG file', async () => {
    const { service, request } = createService();

    await service.uploadRevision('b1', '<svg/>', 'Pump');

    const config = request.mock.calls[0][0];
    const file = (config.data as FormData).get('file') as File;
    expect(config.method).toBe('PUT');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-blocks/b1/image');
    expect(await file.text()).toBe('<svg/>');
  });

  it('lists the usages of a block', async () => {
    const { service, request } = createService();

    await service.getUsages('b1');

    expect(request.mock.calls[0][0].url).toBe('https://host/api/v1/structure/process-image-blocks/b1/usages');
  });

  it('is not available on v4', async () => {
    const { service, request } = createService('4.23.0');

    await expect(service.getBlock('b1')).rejects.toThrow(EndpointNotAvailableError);
    expect(request).not.toHaveBeenCalled();
  });
});
