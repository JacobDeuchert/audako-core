import { TenantView } from '../models/tenant-view.model.js';
import { BaseHttpService } from './base-http.service.js';
export declare class TenantHttpService extends BaseHttpService {
    getTenantViewById(id: string): Promise<TenantView>;
    getTenantViewForEntityId(entityId: string): Promise<TenantView>;
    getTopTenants(): Promise<TenantView[]>;
    getNextTenants(tenantId: string): Promise<TenantView[]>;
    filterTenantsByName(name: string): Promise<TenantView[]>;
    /** All tenant endpoints are plain reads whose response shape is identical on v4 and v5. */
    private _get;
}
