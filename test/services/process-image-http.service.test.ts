import { describe, expect, it } from 'vitest';
import { ProcessImageHttpService } from '../../lib/services/process-image-http.service.js';
import { stubContext } from './api-context-stub.js';

function createService(version: '4.23.0' | '5.0.0') {
  const { ctx, request } = stubContext(version);
  request.mockResolvedValue({ status: 200, data: '<svg/>', headers: {} });
  return { service: new ProcessImageHttpService(ctx), request: request };
}

describe('ProcessImageHttpService.uploadProcessImage', () => {
  it('sends the SVG as multipart field "file"', async () => {
    const { service, request } = createService('5.0.0');

    await service.uploadProcessImage('p1', '<svg/>', 'plant.svg');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('PUT');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-rendering/upload/p1');
    const file = (config.data as FormData).get('file') as File;
    expect(file.name).toBe('plant.svg');
    expect(file.type).toBe('image/svg+xml');
    expect(await file.text()).toBe('<svg/>');
  });
});

describe('ProcessImageHttpService.getProcessImageSvg', () => {
  it('reads the generic entity file on v4', async () => {
    const { service, request } = createService('4.23.0');

    await expect(service.getProcessImageSvg('p1')).resolves.toBe('<svg/>');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/structure/scada/ProcessImage/p1/file/image');
    expect(config.responseType).toBe('text');
  });

  it('reads the native process image route on v5', async () => {
    const { service, request } = createService('5.0.0');

    await expect(service.getProcessImageSvg('p1')).resolves.toBe('<svg/>');

    expect(request.mock.calls[0][0].url).toBe('https://host/api/v1/structure/process-images/p1/image');
  });
});

describe('ProcessImageHttpService.getRenderedProcessImage', () => {
  it('requests the stored render without a basetag', async () => {
    const { service, request } = createService('5.0.0');

    await expect(service.getRenderedProcessImage('p1')).resolves.toBe('<svg/>');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('PUT');
    expect(config.url).toBe('https://host/api/v1/structure/process-image-rendering/download/p1');
    expect(config.data).toEqual({ Basetag: null });
    expect(config.responseType).toBe('text');
  });

  it('sends the basetag in the body', async () => {
    const { service, request } = createService('4.23.0');

    await service.getRenderedProcessImage('p1', 'Plant.Line1');

    expect(request.mock.calls[0][0].url).toBe('https://host/api/structure/processimagerender/download/p1');
    expect(request.mock.calls[0][0].data).toEqual({ Basetag: 'Plant.Line1' });
  });
});
