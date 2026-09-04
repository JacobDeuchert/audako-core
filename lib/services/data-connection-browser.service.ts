import { BaseHttpService } from './base-http.service.js';

/**
 * One node of a data connection browse result. v5 types the response explicitly with lowercased
 * JSON names; v4 answered with the same shape but was declared `any`.
 */
export interface ConnectionBrowseItem {
  description?: string;
  address?: string;
  expandable?: boolean;
  selectable?: boolean;
}

export class DataConnectionBrowserService extends BaseHttpService {
  /** `POST {driver}/command/conn/{id}/browse` with `{Path}`. Request identical on v4 and v5. */
  public async browseConnection(id: string, path: string): Promise<ConnectionBrowseItem[]> {
    const endpoint = await this.resolve({ name: 'driverBrowseConnection', dataConnectionId: id });
    const response = await this.ctx.http.request<ConnectionBrowseItem[]>({
      method: endpoint.method,
      url: endpoint.url,
      data: { Path: path },
    });
    return response.data;
  }
}
