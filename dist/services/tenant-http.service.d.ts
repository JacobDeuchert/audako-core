import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model';
import { TenantView } from '../models/tenant-view.model';
import { BaseHttpService } from './base-http.service';
export declare class TenantHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, accessToken: string | Observable<string>);
    getTenantViewById(id: string): Promise<TenantView>;
    getTopTenants(): Promise<TenantView[]>;
    getNextTenants(tenantId: string): Promise<TenantView[]>;
}
