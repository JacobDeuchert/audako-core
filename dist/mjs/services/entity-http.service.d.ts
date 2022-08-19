import { ConfigurationEntity, EntityType } from '../models/entities/configuration-entity.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { BaseHttpService } from './base-http.service.js';
export declare type PaginationResponse<T> = {
    data: T[];
    total: number;
};
export declare type Projection<T> = {
    [P in keyof T]?: 1 | -1;
} | null;
export declare class EntityHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>);
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
    private _createBaseUrlByType;
}
