import { ApiContext } from '../api/api-context.js';

export class ProcessImageHttpService {
  constructor(public readonly ctx: ApiContext) {}

  /**
   * Uploads an SVG through the rendering route, which stores it as `ImageFile` and its render as
   * `RenderedFile` (v5 also fills in block instances).
   */
  public async uploadProcessImage(id: string, svg: string, name: string = 'process-image.svg'): Promise<void> {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file', blob, name);
    await this.ctx.request<void>({ name: 'processImageUpload', id: id }, { data: formData });
  }

  /**
   * The uploaded SVG, without rendering. On v5 it is the upload with block instances filled in,
   * so it only matches the uploaded bytes when the image uses no blocks.
   */
  public async getProcessImageSvg(id: string): Promise<string> {
    const response = await this.ctx.request<string>({ name: 'processImageFile', id: id }, { responseType: 'text' });
    return response.data;
  }

  /**
   * The rendered SVG. With a `basetag` the image is rendered dynamically against that basetag
   * (cached server side); without one the stored render is returned.
   */
  public async getRenderedProcessImage(id: string, basetag?: string): Promise<string> {
    const response = await this.ctx.request<string>(
      { name: 'processImageRendered', id: id },
      { data: { Basetag: basetag ?? null }, responseType: 'text' },
    );
    return response.data;
  }
}
