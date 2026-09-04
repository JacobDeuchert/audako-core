import { AxiosResponse } from 'axios';
import { ApiContext } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { parseApiError } from '../api/errors.js';
// Imported through the adapter entry point so the v4 adapters register themselves.
import { entityAdapters } from '../compat/adapters/index.js';
import {
  ConfigurationEntity,
  EntityType,
  TranslatableField,
} from '../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export type PaginationResponse<T> = {
  data: T[];
  total: number;
};

export type Projection<T> = { [P in keyof T]?: 1 | -1 } | null;

/** Sort specification for a query: field name -> ascending (1) or descending (-1). */
export type SortSpecification<T> = { [P in keyof T]?: 1 | -1 } | { [p: string]: 1 | -1 };

/** Paging window of a query. */
export interface QueryPaging {
  skip: number;
  limit: number;
}

/** Optional v5-only extras of {@link EntityHttpService.queryConfiguration}. */
export interface QueryOptions<T> {
  /**
   * JSON sort specification, e.g. `{ 'Name.Value': 1 }`. v5 only; silently ignored on v4,
   * which has no sort support on the query endpoint.
   */
  sort?: SortSpecification<T>;
  /**
   * BCP-47 language sent as the `Language` header. Enables `Name.TranslatedValue` in filters
   * and sorts. v5 only; an invalid tag makes the platform answer 400.
   */
  language?: string;
}

/**
 * Slim entity descriptor returned by the v5 `entity-info` endpoint.
 *
 * The analysis doc only lists the field names (`{Id, Name, Description, Type?, GroupId, Path}`),
 * so `Name`/`Description` are assumed to carry the same `TranslatableField` shape as on the
 * entity itself. Plain strings are tolerated by the consumers in core (see `EntityNameService`).
 */
export interface EntityInfo {
  Id: string;
  Name: TranslatableField<string> | string;
  Description?: TranslatableField<string> | string;
  Type?: EntityType;
  GroupId?: string;
  Path?: string[];
}

/** Optional filter/sort/paging arguments of {@link EntityHttpService.getEntityInfos}. */
export interface EntityInfoOptions<T = any> {
  /** Same `$filter` object `queryConfiguration` takes. */
  filter?: { [p: string]: any };
  sort?: SortSpecification<T>;
  paging?: QueryPaging;
  /** BCP-47 language for the `Language` header. */
  language?: string;
}

/** Appends `key=value` to a URL, keeping the existing query string intact. */
function withQueryParam(url: string, key: string, value: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`;
}

export class EntityHttpService extends BaseHttpService {
  /**
   * @param ctx Context of the target system.
   */
  constructor(ctx: ApiContext);
  /**
   * @deprecated Pass an `ApiContext` instead.
   */
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
  constructor(httpConfigOrCtx: ApiContext | AsyncValue<HttpConfig>, accessToken?: AsyncValue<string>) {
    super(httpConfigOrCtx as any, accessToken as any);
  }

  public async getEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string): Promise<T> {
    return this.getPartialEntityById(entityType, id, null) as Promise<T>;
  }

  /**
   * `GET {entity}/{id}`, optionally projected. `$projection` is a query string parameter on both
   * versions; projection keys are canonical field names and are never rewritten (plan decision 7).
   */
  public async getPartialEntityById<T extends ConfigurationEntity>(
    entityType: EntityType,
    id: string,
    projection: Projection<T>,
  ): Promise<Partial<T>> {
    const endpoint = await this.resolve({ name: 'entityById', entityType: entityType, id: id });
    const url = projection ? withQueryParam(endpoint.url, '$projection', JSON.stringify(projection)) : endpoint.url;

    const response = await this._request<Partial<T>>({ method: endpoint.method, url: url });
    return this._fromWire<Partial<T>>(entityType, response.data, await this.getVersionInfo());
  }

  /**
   * Queries a collection.
   *
   * - v4: `POST {entity}/query` with `{$filter, $paging, $projection}` in the body.
   * - v5: the `QUERY` verb on the collection root with `{$filter, $paging, $sort}` in the body and
   *   `$projection` in the query string.
   *
   * The `QUERY` verb is open item 1 of docs/v4-v5-compatibility-plan.md: it works with axios in
   * Node, but browser XHR/fetch support has not been verified end to end through the proxy. There
   * is deliberately no POST fallback here - `POST {entity}/query` answers 405 on v5, so a fallback
   * could only be provided platform-side.
   */
  public async queryConfiguration<T extends ConfigurationEntity>(
    entityType: EntityType,
    query: { [p: string]: any },
    paging?: QueryPaging,
    projection?: { [p in keyof T]?: number },
    options?: QueryOptions<T>,
  ): Promise<PaginationResponse<Partial<T>>> {
    const versionInfo = await this.getVersionInfo();
    const endpoint = await this.resolve({ name: 'entityQuery', entityType: entityType });

    const filter = JSON.stringify(query);
    const pagingValue = paging ? JSON.stringify(paging) : null;
    const projectionValue = projection ? JSON.stringify(projection) : null;
    const sortValue = options?.sort ? JSON.stringify(options.sort) : null;

    let url = endpoint.url;
    let body: { [p: string]: string };
    const headers: { [p: string]: string } = {};

    if (versionInfo.supports('queryVerb')) {
      body = { $filter: filter, $paging: pagingValue, $sort: sortValue };
      if (projectionValue) {
        url = withQueryParam(url, '$projection', projectionValue);
      }
      if (options?.language) {
        headers['Language'] = options.language;
      }
    } else {
      // v4 has neither $sort nor the Language header; both are dropped.
      body = { $filter: filter, $paging: pagingValue, $projection: projectionValue };
    }

    const response = await this._request<Partial<T>[]>({
      method: endpoint.method,
      url: url,
      data: body,
      headers: headers,
    });

    const data = (response.data || []).map((item) => this._fromWire<Partial<T>>(entityType, item, versionInfo));

    // `Paging-Headers: {"TotalCount":N}` is unchanged in v5 and only sent when $paging was.
    const pagingHeader = paging ? (response.headers as any)?.['paging-headers'] : null;
    if (pagingHeader) {
      return {
        data: data,
        total: Number(JSON.parse(pagingHeader as string).TotalCount),
      };
    }

    return {
      data: data,
      total: data.length,
    };
  }

  public async uploadProcessImage(id: string, svg: string, name: string = 'process-image.svg'): Promise<void> {
    const endpoint = await this.resolve({ name: 'processImageUpload', id: id });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file', blob, name);
    await this._request<void>({ method: endpoint.method, url: endpoint.url, data: formData });
  }

  public async addEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T> {
    const versionInfo = await this.getVersionInfo();
    const endpoint = await this.resolve({ name: 'entityCollection', entityType: type });
    const payload = this._toWire(type, entity, versionInfo);

    const response = await this._request<T>({ method: endpoint.method, url: endpoint.url, data: payload });
    return this._fromWire<T>(type, response.data, versionInfo);
  }

  /**
   * `PUT {entity}/{id}`.
   *
   * The caller's instance is never modified; everything happens on the wire copy. On v4 the copy
   * loses `CreatedBy`/`CreatedOn` (the platform answers 400 when they are present); on v5 both are
   * kept (the platform restores them anyway) and `ChangedOn` is round-tripped, because it is the
   * optimistic-concurrency token there (feature `optimisticConcurrency`).
   *
   * @throws EntityLockedError on 423, when the entity is in a locked subtree (v5).
   * @throws ApiError on 400, e.g. when `entity.Id` does not match the route id (v5).
   */
  public async updateEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T> {
    const versionInfo = await this.getVersionInfo();
    const endpoint = await this.resolve({ name: 'entityById', entityType: type, id: entity.Id });
    const payload = this._toWire(type, entity, versionInfo);

    const response = await this._request<T>({ method: 'PUT', url: endpoint.url, data: payload });
    return this._fromWire<T>(type, response.data, versionInfo);
  }

  /** `DELETE {entity}/{id}`. 204 on both versions. */
  public async deleteEntity(type: EntityType, id: string): Promise<void> {
    const endpoint = await this.resolve({ name: 'entityById', entityType: type, id: id });
    await this._request<void>({ method: 'DELETE', url: endpoint.url });
  }

  public async copyTo<T extends ConfigurationEntity>(
    sourceEntityId: string,
    targetGroupId: string,
    type: EntityType,
  ): Promise<T> {
    const endpoint = await this.resolve({
      name: 'entityCopy',
      entityType: type,
      sourceId: sourceEntityId,
      targetId: targetGroupId,
    });
    const response = await this._request<T>({ method: endpoint.method, url: endpoint.url });
    return this._fromWire<T>(type, response.data, await this.getVersionInfo());
  }

  /**
   * Starts a bulk copy and returns the operation id. v4 answers with the bare id as text, v5 with
   * `{"OperationId":"..."}`; both are normalized to the id string.
   */
  public async copyMultipleTo(sourceEntityIds: string[], targetId: string, type: EntityType): Promise<string> {
    const endpoint = await this.resolve({ name: 'entityCopyMultiple', entityType: type, targetId: targetId });
    const response = await this._request<any>({ method: endpoint.method, url: endpoint.url, data: sourceEntityIds });
    return this._readOperationId(response.data);
  }

  public async moveTo<T extends ConfigurationEntity>(
    sourceEntityId: string,
    targetGroupId: string,
    type: EntityType,
  ): Promise<T> {
    const endpoint = await this.resolve({
      name: 'entityMove',
      entityType: type,
      sourceId: sourceEntityId,
      targetId: targetGroupId,
    });
    const response = await this._request<T>({ method: endpoint.method, url: endpoint.url });
    return this._fromWire<T>(type, response.data, await this.getVersionInfo());
  }

  /** Starts a bulk move and returns the operation id. See {@link copyMultipleTo}. */
  public async moveMultipleTo(sourceIds: string[], targetId: string, type: EntityType): Promise<string> {
    const endpoint = await this.resolve({ name: 'entityMoveMultiple', entityType: type, targetId: targetId });
    const response = await this._request<any>({ method: endpoint.method, url: endpoint.url, data: sourceIds });
    return this._readOperationId(response.data);
  }

  /**
   * `GET {entity}/count?$filter=` - number of entities matching the filter.
   *
   * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityCount')`; on v4 this
   * throws {@link UnsupportedApiVersionError} because the endpoint does not exist.
   */
  public async countEntities(entityType: EntityType, filter?: { [p: string]: any }): Promise<number> {
    const endpoint = await this.resolve({ name: 'entityCount', entityType: entityType });
    const url = filter ? withQueryParam(endpoint.url, '$filter', JSON.stringify(filter)) : endpoint.url;

    const response = await this._request<number | string>({ method: endpoint.method, url: url });
    return Number(response.data);
  }

  /**
   * `GET {entity}/entity-info?$filter=&$sort=&$paging=` - `{Id, Name, Description, Type, GroupId,
   * Path}` for a whole filtered set in one request, replacing per-id lookups.
   *
   * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityInfo')`; on v4 this
   * throws {@link UnsupportedApiVersionError}.
   */
  public async getEntityInfos(entityType: EntityType, options?: EntityInfoOptions): Promise<EntityInfo[]> {
    const endpoint = await this.resolve({ name: 'entityInfo', entityType: entityType });

    let url = endpoint.url;
    if (options?.filter) {
      url = withQueryParam(url, '$filter', JSON.stringify(options.filter));
    }
    if (options?.sort) {
      url = withQueryParam(url, '$sort', JSON.stringify(options.sort));
    }
    if (options?.paging) {
      url = withQueryParam(url, '$paging', JSON.stringify(options.paging));
    }

    const headers: { [p: string]: string } = {};
    if (options?.language) {
      headers['Language'] = options.language;
    }

    const response = await this._request<EntityInfo[]>({ method: endpoint.method, url: url, headers: headers });
    return response.data || [];
  }

  /**
   * Slim entity descriptors for a set of ids, in one request.
   *
   * Assumption: `$filter` accepts the store's `{ Id: { $in: [...] } }` operator form, as the
   * analysis doc documents no filter grammar for `entity-info`.
   */
  public getEntityInfosByIds(entityType: EntityType, ids: string[], language?: string): Promise<EntityInfo[]> {
    return this.getEntityInfos(entityType, { filter: { Id: { $in: ids } }, language: language });
  }

  /** Runs a request on the context's axios instance and normalizes failures to `ApiError`. */
  private async _request<T>(config: {
    method: string;
    url: string;
    data?: any;
    headers?: { [p: string]: string };
  }): Promise<AxiosResponse<T>> {
    try {
      return await this.ctx.http.request<T, AxiosResponse<T>>({
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /** Wire -> canonical model, through the entity's adapter. */
  private _fromWire<T>(entityType: EntityType, wire: any, versionInfo: ApiVersionInfo): T {
    return entityAdapters.applyFromWire<T>(entityType, wire, versionInfo);
  }

  /**
   * Canonical model -> wire payload. Always returns a copy: `applyToWire` strips the server-owned
   * `Path`/`AclAllow`/`AclDeny` on a shallow clone, so the caller's instance stays untouched.
   */
  private _toWire<T extends ConfigurationEntity>(type: EntityType, entity: T, versionInfo: ApiVersionInfo): any {
    const payload = entityAdapters.applyToWire<T>(type, entity, versionInfo);

    if (!versionInfo.supports('optimisticConcurrency')) {
      // v4 answers 400 when CreatedBy/CreatedOn are present. v5 restores them server-side and
      // uses ChangedOn as an optimistic-concurrency token, so everything is round-tripped there.
      delete payload.CreatedBy;
      delete payload.CreatedOn;
    }

    return payload;
  }

  /** `{"OperationId":"..."}` (v5), a JSON string of it, or the bare id as text (v4). */
  private _readOperationId(data: any): string {
    if (data && typeof data === 'object') {
      return data.OperationId;
    }

    if (typeof data === 'string') {
      const value = data.trim();
      if (value.startsWith('{')) {
        try {
          return JSON.parse(value).OperationId;
        } catch {
          return value;
        }
      }
      return value;
    }

    return data;
  }
}
