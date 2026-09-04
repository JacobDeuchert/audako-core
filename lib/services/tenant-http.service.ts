import { TenantView } from '../models/tenant-view.model.js';
import { Endpoint } from '../compat/endpoints/endpoint-resolver.js';
import { BaseHttpService } from './base-http.service.js';

export class TenantHttpService extends BaseHttpService {
  public getTenantViewById(id: string): Promise<TenantView> {
    return this._get<TenantView>({ name: 'tenantViewById', tenantId: id });
  }

  public getTenantViewForEntityId(entityId: string): Promise<TenantView> {
    return this._get<TenantView>({ name: 'tenantViewForEntity', entityId: entityId });
  }

  public getTopTenants(): Promise<TenantView[]> {
    return this._get<TenantView[]>({ name: 'tenantsTop' });
  }

  public getNextTenants(tenantId: string): Promise<TenantView[]> {
    return this._get<TenantView[]>({ name: 'tenantsNext', tenantId: tenantId });
  }

  public filterTenantsByName(name: string): Promise<TenantView[]> {
    return this._get<TenantView[]>({ name: 'tenantsFilter', filter: name });
  }

  /** All tenant endpoints are plain reads whose response shape is identical on v4 and v5. */
  private async _get<T>(endpoint: Endpoint): Promise<T> {
    const resolved = await this.resolve(endpoint);
    const response = await this.ctx.http.request<T>({ method: resolved.method, url: resolved.url });
    return response.data;
  }
}
