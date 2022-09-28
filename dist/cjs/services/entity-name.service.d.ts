import { EntityType } from '../models/entities/configuration-entity.model.js';
import { EntityHttpService } from './entity-http.service.js';
export declare class EntityNameService {
    private httpService;
    private _nameCache;
    constructor(httpService: EntityHttpService);
    resolveEntityPath(entityType: EntityType, id: string, includeSelf?: boolean, limit?: number): Promise<string>;
    resolvePathName(idPath: string[]): Promise<string>;
    resolveName(entityType: EntityType, id: string): Promise<string>;
}
