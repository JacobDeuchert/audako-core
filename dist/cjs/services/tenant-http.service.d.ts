import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export declare class TenantHttpService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    getTenantViewById(id: string): Promise<TenantView>;
    getTopTenants(): Promise<TenantView[]>;
    getNextTenants(tenantId: string): Promise<TenantView[]>;
    filterTenantsByName(name: string): Promise<TenantView[]>;
}
