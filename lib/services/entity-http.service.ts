import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ConfigurationEntity, EntityHttpEndpoints, EntityType } from '../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { BaseHttpService } from './base-http.service.js';

export type PaginationResponse<T> = {
  data: T[];
  total: number;
};

export type Projection<T> = { [P in keyof T]?: 1 | -1 } | null;
export class EntityHttpService extends BaseHttpService {
  constructor(httpConfig: HttpConfig, accessToken: string | Observable<string>) {
    super(httpConfig, accessToken);
  }

  public async getEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string): Promise<T> {
    return this.getPartialEntityById(entityType, id, null) as Promise<T>;
  }

  public async getPartialEntityById<T extends ConfigurationEntity>(
    entityType: EntityType,
    id: string,
    projection: Projection<T>
  ): Promise<Partial<T>> {
    let url = `${this._createBaseUrlByType(entityType)}/${id}`;

    if (projection) {
      url += `?$projection=${JSON.stringify(projection)}`;
    }

    const headers = this.getAuthorizationHeader();
    const response = await axios.get<T>(url, { headers: headers });
    return response.data;
  }

  public async queryConfiguration<T extends ConfigurationEntity>(
    entityType: EntityType,
    query: { [p: string]: any },
    paging?: { skip: number; limit: number },
    projection?: { [p in keyof T]?: number }
  ): Promise<PaginationResponse<Partial<T>>> {
    const url = `${this._createBaseUrlByType(entityType)}/query`;

    const queryBody = {
      $filter: JSON.stringify(query),
      $paging: paging ? JSON.stringify(paging) : null,
      $projection: projection ? JSON.stringify(projection) : null,
    };

    const headers = this.getAuthorizationHeader();

    const response = await axios.post<
      { $filter: string; $paging: string; $projection: string },
      AxiosResponse<Partial<T>[]>
    >(url, queryBody, { headers: headers });
    if (paging) {
      console.log(response.headers);
      const pagingResponseHeader = JSON.parse(response.headers['paging-headers']);
      const totalCount = Number(pagingResponseHeader.TotalCount);
      return {
        data: response.data,
        total: totalCount,
      };
    }

    return {
      data: response.data,
      total: response.data.length,
    };
  }

  public async resolvePathName(idPath: string[]): Promise<string> {
    const pathGroups = await this.queryConfiguration(EntityType.Group, { Id: { $in: idPath } });
    return idPath.map((id) => pathGroups.data.find((x) => x.Id === id)?.Name ?? id).join('/');
  }

  public async uploadProcessImage(id: string, svg: string, name: string = 'process-image.svg'): Promise<void> {
    const url = `${this._createBaseUrlByType(EntityType.ProcessImage)}/${id}/file/image`;
    const headers = this.getAuthorizationHeader();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file', blob, 'process-image.svg');
    await axios.post<number>(url, formData, { headers: headers });
  }

  private _createBaseUrlByType(entityType: EntityType): string {
    return `${this.getStructureUrl}/${EntityHttpEndpoints[entityType]}`;
  }
}
