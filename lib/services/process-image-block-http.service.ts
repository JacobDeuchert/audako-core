import { ApiContext } from '../api/api-context.js';
import {
  ProcessImageBlock,
  ProcessImageBlockMaterialization,
  ProcessImageBlockPreview,
  ProcessImageBlockPreviewRequest,
  ProcessImageBlockRevision,
  ProcessImageBlockUsage,
} from '../models/process-image-block.model.js';

/** Process image blocks exist on v5 only; gate calls with `supports('processImageBlocks')`. */
export class ProcessImageBlockHttpService {
  constructor(public readonly ctx: ApiContext) {}

  public async getBlocks(tenantId: string): Promise<ProcessImageBlock[]> {
    const response = await this.ctx.request<ProcessImageBlock[]>(
      { name: 'processImageBlocks' },
      { params: { tenantId: tenantId } },
    );
    return response.data;
  }

  public async getBlock(blockId: string): Promise<ProcessImageBlock> {
    const response = await this.ctx.request<ProcessImageBlock>({ name: 'processImageBlockById', blockId: blockId });
    return response.data;
  }

  /** The block SVG exactly as uploaded. */
  public async getImage(blockId: string): Promise<string> {
    const response = await this.ctx.request<string>(
      { name: 'processImageBlockImage', blockId: blockId },
      { responseType: 'text' },
    );
    return response.data;
  }

  /** Parameters and size of one revision, the current one included. */
  public async getRevision(blockId: string, revision: number): Promise<ProcessImageBlockRevision> {
    const response = await this.ctx.request<ProcessImageBlockRevision>({
      name: 'processImageBlockRevision',
      blockId: blockId,
      revision: revision,
    });
    return response.data;
  }

  /** The block as a standalone SVG with its parameter defaults applied; without `revision` the current one. */
  public async getPreview(blockId: string, revision?: number): Promise<string> {
    const response = await this.ctx.request<string>(
      { name: 'processImageBlockPreview', blockId: blockId },
      { responseType: 'text', params: revision === undefined ? undefined : { revision: revision } },
    );
    return response.data;
  }

  /** At most 200 entries per call; unknown blocks and revisions are left out. */
  public async getPreviews(blocks: ProcessImageBlockPreviewRequest[]): Promise<ProcessImageBlockPreview[]> {
    const response = await this.ctx.request<ProcessImageBlockPreview[]>(
      { name: 'processImageBlockPreviews' },
      { data: { Blocks: blocks } },
    );
    return response.data;
  }

  /** The content of one block instance with the given parameter values; without `revision` from the current one. */
  public async materialize(
    blockId: string,
    instanceId: string,
    params: Record<string, string>,
    revision?: number,
  ): Promise<ProcessImageBlockMaterialization> {
    const response = await this.ctx.request<ProcessImageBlockMaterialization>(
      { name: 'processImageBlockMaterialization', blockId: blockId },
      { data: { InstanceId: instanceId, Params: params, Revision: revision } },
    );
    return response.data;
  }

  public async createBlock(tenantId: string, svg: string, name: string): Promise<ProcessImageBlock> {
    const formData = this._svgForm(svg, name);
    formData.append('name', name);
    const response = await this.ctx.request<ProcessImageBlock>(
      { name: 'processImageBlockCreate' },
      { data: formData, params: { tenantId: tenantId } },
    );
    return response.data;
  }

  /** Overwrites the current revision while it is unsealed, otherwise uploads a new one; the platform answers 400 with every validation problem at once. */
  public async uploadRevision(blockId: string, svg: string, name: string): Promise<ProcessImageBlock> {
    const response = await this.ctx.request<ProcessImageBlock>(
      { name: 'processImageBlockImageUpload', blockId: blockId },
      { data: this._svgForm(svg, name) },
    );
    return response.data;
  }

  public async getUsages(blockId: string): Promise<ProcessImageBlockUsage[]> {
    const response = await this.ctx.request<ProcessImageBlockUsage[]>({
      name: 'processImageBlockUsages',
      blockId: blockId,
    });
    return response.data;
  }

  private _svgForm(svg: string, name: string): FormData {
    const formData = new FormData();
    formData.append('file', new Blob([svg], { type: 'image/svg+xml' }), `${name}.svg`);
    return formData;
  }
}
