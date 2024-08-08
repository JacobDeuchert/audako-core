import { ConfigurationEntity, EntityType } from '../models/entities/configuration-entity.model.js';
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
export declare class EntityHttpService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    getEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string): Promise<T>;
    getPartialEntityById<T extends ConfigurationEntity>(entityType: EntityType, id: string, projection: Projection<T>): Promise<Partial<T>>;
    queryConfiguration<T extends ConfigurationEntity>(entityType: EntityType, query: {
        [p: string]: any;
    }, paging?: {
        skip: number;
        limit: number;
    }, projection?: {
        [p in keyof T]?: number;
    }): Promise<PaginationResponse<Partial<T>>>;
    resolvePathName(idPath: string[]): Promise<string>;
    uploadProcessImage(id: string, svg: string, name?: string): Promise<void>;
    addEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T>;
    updateEntity<T extends ConfigurationEntity>(type: EntityType, entity: T): Promise<T>;
    deleteEntity(type: EntityType, id: string): Promise<void>;
    copyTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: EntityType): Promise<T>;
    copyMultipleTo(sourceEntityIds: string[], targetId: string, type: any): Promise<string>;
    moveTo<T extends ConfigurationEntity>(sourceEntityId: string, targetGroupId: string, type: any): Promise<T>;
    moveMultipleTo(sourceIds: string[], targetId: string, type: any): Promise<string>;
    private _createBaseUrlByType;
}
