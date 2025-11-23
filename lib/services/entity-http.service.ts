import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ConfigurationEntity, EntityHttpEndpoints, EntityType } from '../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export type PaginationResponse<T> = {
  data: T[];
  total: number;
};

export type Projection<T> = { [P in keyof T]?: 1 | -1 } | null;
export class EntityHttpService extends BaseHttpService {
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
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
    let url = `${await this._createBaseUrlByType(entityType)}/${id}`;

    if (projection) {
      url += `?$projection=${JSON.stringify(projection)}`;
    }

    const headers = await this.getAuthorizationHeader();
    const response = await axios.get<T>(url, { headers: headers });
    return response.data;
  }

  public async queryConfiguration<T extends ConfigurationEntity>(
    entityType: EntityType,
    query: { [p: string]: any },
    paging?: { skip: number; limit: number },
    projection?: { [p in keyof T]?: number }
  ): Promise<PaginationResponse<Partial<T>>> {
    const url = `${await this._createBaseUrlByType(entityType)}/query`;

    const queryBody = {
      $filter: JSON.stringify(query),
      $paging: paging ? JSON.stringify(paging) : null,
      $projection: projection ? JSON.stringify(projection) : null,
    };

    const headers = await this.getAuthorizationHeader();

    const response = await axios.post<
      { $filter: string; $paging: string; $projection: string },
      AxiosResponse<Partial<T>[]>
    >(url, queryBody, { headers: headers });
    if (paging) {
      console.log(response.headers);
      const pagingResponseHeader = JSON.parse(response.headers['paging-headers'] as string);
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

  public async uploadProcessImage(id: string, svg: string, name: string = 'process-image.svg'): Promise<void> {
    const url = `${await this._createBaseUrlByType(EntityType.ProcessImage)}/${id}/file/image`;
    const headers = await this.getAuthorizationHeader();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file', blob, 'process-image.svg');
    await axios.post<number>(url, formData, { headers: headers });
  }

  public async addEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T> {
    const url = await this._createBaseUrlByType(type);
    const headers = await this.getAuthorizationHeader();
    return axios.post<T>(url, entity, { headers: headers }).then((response) => response.data);
  }

  public async updateEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T> {
    const url = `${await this._createBaseUrlByType(type)}/${entity.Id}`;
    const headers = await this.getAuthorizationHeader();
    return axios.put<T>(url, entity, { headers: headers }).then((response) => response.data);
  }

  public async deleteEntity(type: EntityType, id: string): Promise<void> {
    const url = `${await this._createBaseUrlByType(type)}/${id}`;
    const headers = await this.getAuthorizationHeader();
    return axios.delete<void>(url, { headers: headers }).then();
  }

  public async copyTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: EntityType): Promise<T> {
    const url: string = `${await this._createBaseUrlByType(type)}/copy/${sourceEntityId}/to/${targetGroupId}`;
    const headers = await this.getAuthorizationHeader();
    return axios.get<T>(url, {headers}).then((response) => response.data)
  }

  public async copyMultipleTo(sourceEntityIds: string[], targetId: string, type: any): Promise<string> {
    const url: string = `${await this._createBaseUrlByType(type)}/copy/multiple/${targetId}`;
    const headers = await this.getAuthorizationHeader();
    return axios.put(url, sourceEntityIds, { responseType: 'text', headers: headers });
  }

  public async moveTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: any): Promise<T> {
    const url: string = `${await this._createBaseUrlByType(type)}/move/${sourceEntityId}/to/${targetGroupId}`;
    const headers = await this.getAuthorizationHeader();
    return axios.get<T>(url, {headers}).then((response) => response.data);
  }

  public async moveMultipleTo(sourceIds: string[], targetId: string, type: any): Promise<string> {
    const url: string = `${await this._createBaseUrlByType(type)}/move/multiple/${targetId}`;
    const headers = await this.getAuthorizationHeader();
    return axios.put(url, sourceIds, { responseType: 'text', headers: headers });
  }

  private async _createBaseUrlByType(entityType: EntityType): Promise<string> {
    return `${await this.getStructureUrl()}${EntityHttpEndpoints[entityType]}`;
  }
}
