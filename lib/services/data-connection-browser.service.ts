import { ApiContext } from '../api/api-context.js';

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

export class DataConnectionBrowserService {
  constructor(public readonly ctx: ApiContext) {}

  /** `POST {driver}/command/conn/{id}/browse` with `{Path}`. Request identical on v4 and v5. */
  public async browseConnection(id: string, path: string): Promise<ConnectionBrowseItem[]> {
    const response = await this.ctx.request<ConnectionBrowseItem[]>(
      { name: 'driverBrowseConnection', dataConnectionId: id },
      { data: { Path: path } },
    );
    return response.data;
  }
}
