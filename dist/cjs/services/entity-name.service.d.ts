import { EntityType } from '../models/entities/configuration-entity.model.js';
import { EntityHttpService } from './entity-http.service.js';
export declare class EntityNameService {
    private httpService;
    private _nameCache;
    constructor(httpService: EntityHttpService);
    resolveEntityPath(entityType: EntityType, id: string, includeSelf?: boolean, limit?: number, separator?: string): Promise<string>;
    resolvePathName(idPath: string[], separator?: string): Promise<string>;
    resolveName(entityType: EntityType, id: string): Promise<string>;
    /**
     * Names of several entities of one type, in the order of `ids`. Unresolvable ids resolve to the
     * id itself. Names are cached per id for the lifetime of the service.
     *
     * On v5 the uncached ids are fetched with a single `entity-info` request
     * (`supports('entityInfo')`); on v4 one projected `GET` per id is issued, as before.
     */
    resolveNames(entityType: EntityType, ids: string[]): Promise<string[]>;
    /** Fills the cache from one `entity-info` request. Ids the platform did not return stay uncached. */
    private _cacheFromEntityInfo;
    /** Legacy path: one projected `GET` per id. */
    private _cacheSingle;
}
