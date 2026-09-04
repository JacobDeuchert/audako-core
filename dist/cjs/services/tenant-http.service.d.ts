import { ApiContext } from '../api/api-context.js';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export declare class TenantHttpService extends BaseHttpService {
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    getTenantViewById(id: string): Promise<TenantView>;
    getTenantViewForEntityId(entityId: string): Promise<TenantView>;
    getTopTenants(): Promise<TenantView[]>;
    getNextTenants(tenantId: string): Promise<TenantView[]>;
    filterTenantsByName(name: string): Promise<TenantView[]>;
    /** All tenant endpoints are plain reads whose response shape is identical on v4 and v5. */
    private _get;
}
