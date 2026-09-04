import { ApiContext } from '../api/api-context.js';
import { ConfigurationEntity, EntityType, TranslatableField } from '../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export type PaginationResponse<T> = {
    data: T[];
    total: number;
};
export type Projection<T> = {
    [P in keyof T]?: 1 | -1;
} | null;
/** Sort specification for a query: field name -> ascending (1) or descending (-1). */
export type SortSpecification<T> = {
    [P in keyof T]?: 1 | -1;
} | {
    [p: string]: 1 | -1;
};
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
    filter?: {
        [p: string]: any;
    };
    sort?: SortSpecification<T>;
    paging?: QueryPaging;
    /** BCP-47 language for the `Language` header. */
    language?: string;
}
export declare class EntityHttpService extends BaseHttpService {
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    getEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string): Promise<T>;
    /**
     * `GET {entity}/{id}`, optionally projected. `$projection` is a query string parameter on both
     * versions; projection keys are canonical field names and are never rewritten (plan decision 7).
     */
    getPartialEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string, projection: Projection<T>): Promise<Partial<T>>;
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
    queryConfiguration<T extends ConfigurationEntity>(entityType: EntityType, query: {
        [p: string]: any;
    }, paging?: QueryPaging, projection?: {
        [p in keyof T]?: number;
    }, options?: QueryOptions<T>): Promise<PaginationResponse<Partial<T>>>;
    uploadProcessImage(id: string, svg: string, name?: string): Promise<void>;
    addEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T>;
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
    updateEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T>;
    /** `DELETE {entity}/{id}`. 204 on both versions. */
    deleteEntity(type: EntityType, id: string): Promise<void>;
    copyTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: EntityType): Promise<T>;
    /**
     * Starts a bulk copy and returns the operation id. v4 answers with the bare id as text, v5 with
     * `{"OperationId":"..."}`; both are normalized to the id string.
     */
    copyMultipleTo(sourceEntityIds: string[], targetId: string, type: EntityType): Promise<string>;
    moveTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: EntityType): Promise<T>;
    /** Starts a bulk move and returns the operation id. See {@link copyMultipleTo}. */
    moveMultipleTo(sourceIds: string[], targetId: string, type: EntityType): Promise<string>;
    /**
     * `GET {entity}/count?$filter=` - number of entities matching the filter.
     *
     * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityCount')`; on v4 this
     * throws {@link UnsupportedApiVersionError} because the endpoint does not exist.
     */
    countEntities(entityType: EntityType, filter?: {
        [p: string]: any;
    }): Promise<number>;
    /**
     * `GET {entity}/entity-info?$filter=&$sort=&$paging=` - `{Id, Name, Description, Type, GroupId,
     * Path}` for a whole filtered set in one request, replacing per-id lookups.
     *
     * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityInfo')`; on v4 this
     * throws {@link UnsupportedApiVersionError}.
     */
    getEntityInfos(entityType: EntityType, options?: EntityInfoOptions): Promise<EntityInfo[]>;
    /**
     * Slim entity descriptors for a set of ids, in one request.
     *
     * Assumption: `$filter` accepts the store's `{ Id: { $in: [...] } }` operator form, as the
     * analysis doc documents no filter grammar for `entity-info`.
     */
    getEntityInfosByIds(entityType: EntityType, ids: string[], language?: string): Promise<EntityInfo[]>;
    /** Runs a request on the context's axios instance and normalizes failures to `ApiError`. */
    private _request;
    /** Wire -> canonical model, through the entity's adapter. */
    private _fromWire;
    /**
     * Canonical model -> wire payload. Always returns a copy: `applyToWire` strips the server-owned
     * `Path`/`AclAllow`/`AclDeny` on a shallow clone, so the caller's instance stays untouched.
     */
    private _toWire;
    /** `{"OperationId":"..."}` (v5), a JSON string of it, or the bare id as text (v4). */
    private _readOperationId;
}
