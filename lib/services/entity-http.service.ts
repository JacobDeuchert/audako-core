import { ApiContext } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { applyFromWire, applyToWire, FromWireMode } from '../compat/adapters/index.js';
import { ConfigurationEntity, EntityType, TranslatableField } from '../models/entities/configuration-entity.model.js';
import { ProcessImageHttpService } from './process-image-http.service.js';

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

/** `JSON.stringify` that leaves `undefined`/`null` alone, for optional query string parameters. */
function json(value: any): string | undefined {
  return value === undefined || value === null ? undefined : JSON.stringify(value);
}

/**
 * All errors surface as `ApiError` (`EntityLockedError` on 423), see `ApiContext.request`.
 */
export class EntityHttpService {
  constructor(public readonly ctx: ApiContext) {}

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
    const response = await this.ctx.request<Partial<T>>(
      { name: 'entityById', entityType: entityType, id: id },
      { method: 'GET', params: { $projection: json(projection) } },
    );
    // A projected read only carries the requested keys: the shared read pass must not fill the
    // rest from the model defaults, or the result would look like real server state.
    return this._fromWire<Partial<T>>(
      entityType,
      response.data,
      await this.ctx.getVersionInfo(),
      projection ? 'projected' : 'full',
    );
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
    const versionInfo = await this.ctx.getVersionInfo();

    const filter = JSON.stringify(query);
    const pagingValue = paging ? JSON.stringify(paging) : null;
    const projectionValue = projection ? JSON.stringify(projection) : null;
    const sortValue = options?.sort ? JSON.stringify(options.sort) : null;

    let body: { [p: string]: string | null };
    let params: { [p: string]: string } | undefined;
    const headers: { [p: string]: string } = {};

    if (versionInfo.supports('queryVerb')) {
      body = { $filter: filter, $paging: pagingValue, $sort: sortValue };
      if (projectionValue) {
        params = { $projection: projectionValue };
      }
      if (options?.language) {
        headers['Language'] = options.language;
      }
    } else {
      // v4 has neither $sort nor the Language header; both are dropped.
      body = { $filter: filter, $paging: pagingValue, $projection: projectionValue };
    }

    const response = await this.ctx.request<Partial<T>[]>(
      { name: 'entityQuery', entityType: entityType },
      { data: body, params: params, headers: headers },
    );

    const mode: FromWireMode = projectionValue ? 'projected' : 'full';
    const data = (response.data || []).map((item) => this._fromWire<Partial<T>>(entityType, item, versionInfo, mode));

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

  /** @deprecated Use {@link ProcessImageHttpService.uploadProcessImage}. */
  public async uploadProcessImage(id: string, svg: string, name: string = 'process-image.svg'): Promise<void> {
    await new ProcessImageHttpService(this.ctx).uploadProcessImage(id, svg, name);
  }

  public async addEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T> {
    const versionInfo = await this.ctx.getVersionInfo();
    const payload = this._toWire(type, entity, versionInfo);

    const response = await this.ctx.request<T>({ name: 'entityCollection', entityType: type }, { data: payload });
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
    if (!entity.Id) {
      throw new Error('updateEntity needs an entity with an Id; use addEntity for new entities.');
    }
    const versionInfo = await this.ctx.getVersionInfo();
    const payload = this._toWire(type, entity, versionInfo);

    const response = await this.ctx.request<T>(
      { name: 'entityById', entityType: type, id: entity.Id },
      { method: 'PUT', data: payload },
    );
    return this._fromWire<T>(type, response.data, versionInfo);
  }

  /** `DELETE {entity}/{id}`. 204 on both versions. */
  public async deleteEntity(type: EntityType, id: string): Promise<void> {
    await this.ctx.request<void>({ name: 'entityById', entityType: type, id: id }, { method: 'DELETE' });
  }

  public async copyTo<T extends ConfigurationEntity>(
    sourceEntityId: string,
    targetGroupId: string,
    type: EntityType,
  ): Promise<T> {
    const response = await this.ctx.request<T>({
      name: 'entityCopy',
      entityType: type,
      sourceId: sourceEntityId,
      targetId: targetGroupId,
    });
    return this._fromWire<T>(type, response.data, await this.ctx.getVersionInfo());
  }

  /**
   * Starts a bulk copy and returns the operation id. v4 answers with the bare id as text, v5 with
   * `{"OperationId":"..."}`; both are normalized to the id string.
   */
  public async copyMultipleTo(sourceEntityIds: string[], targetId: string, type: EntityType): Promise<string> {
    const response = await this.ctx.request<any>(
      { name: 'entityCopyMultiple', entityType: type, targetId: targetId },
      { data: sourceEntityIds },
    );
    return this._readOperationId(response.data);
  }

  public async moveTo<T extends ConfigurationEntity>(
    sourceEntityId: string,
    targetGroupId: string,
    type: EntityType,
  ): Promise<T> {
    const response = await this.ctx.request<T>({
      name: 'entityMove',
      entityType: type,
      sourceId: sourceEntityId,
      targetId: targetGroupId,
    });
    return this._fromWire<T>(type, response.data, await this.ctx.getVersionInfo());
  }

  /** Starts a bulk move and returns the operation id. See {@link copyMultipleTo}. */
  public async moveMultipleTo(sourceIds: string[], targetId: string, type: EntityType): Promise<string> {
    const response = await this.ctx.request<any>(
      { name: 'entityMoveMultiple', entityType: type, targetId: targetId },
      { data: sourceIds },
    );
    return this._readOperationId(response.data);
  }

  /**
   * `GET {entity}/count?$filter=` - number of entities matching the filter.
   *
   * v5 only. Gate calls with `(await service.ctx.getVersionInfo()).supports('entityCount')`; on v4 this
   * throws {@link EndpointNotAvailableError} because the endpoint does not exist.
   */
  public async countEntities(entityType: EntityType, filter?: { [p: string]: any }): Promise<number> {
    const response = await this.ctx.request<number | string>(
      { name: 'entityCount', entityType: entityType },
      { params: { $filter: json(filter) } },
    );
    return Number(response.data);
  }

  /**
   * `GET {entity}/entity-info?$filter=&$sort=&$paging=` - `{Id, Name, Description, Type, GroupId,
   * Path}` for a whole filtered set in one request, replacing per-id lookups.
   *
   * v5 only. Gate calls with `(await service.ctx.getVersionInfo()).supports('entityInfo')`; on v4 this
   * throws {@link EndpointNotAvailableError}.
   */
  public async getEntityInfos(entityType: EntityType, options?: EntityInfoOptions): Promise<EntityInfo[]> {
    const headers: { [p: string]: string } = {};
    if (options?.language) {
      headers['Language'] = options.language;
    }

    const response = await this.ctx.request<EntityInfo[]>(
      { name: 'entityInfo', entityType: entityType },
      {
        params: { $filter: json(options?.filter), $sort: json(options?.sort), $paging: json(options?.paging) },
        headers: headers,
      },
    );
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

  /**
   * Wire -> canonical model, through the entity's adapter.
   *
   * `mode` is `projected` for `$projection` results, where the shared read pass may only fill
   * keys that are on the wire (see {@link FromWireMode}).
   */
  private _fromWire<T>(entityType: EntityType, wire: any, versionInfo: ApiVersionInfo, mode: FromWireMode = 'full'): T {
    return applyFromWire<T>(entityType, wire, versionInfo, mode);
  }

  /**
   * Canonical model -> wire payload. Always returns a copy: `applyToWire` strips the server-owned
   * `Path`/`AclAllow`/`AclDeny` on a shallow clone, so the caller's instance stays untouched.
   */
  private _toWire<T extends ConfigurationEntity>(type: EntityType, entity: T, versionInfo: ApiVersionInfo): any {
    const payload = applyToWire<T>(type, entity, versionInfo);

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
