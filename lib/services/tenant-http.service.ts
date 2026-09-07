import { ApiContext } from '../api/api-context.js';
import { Endpoint } from '../compat/endpoints/endpoint-resolver.js';
import { TenantView } from '../models/tenant-view.model.js';

export class TenantHttpService {
  constructor(public readonly ctx: ApiContext) {}

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
    const response = await this.ctx.request<T>(endpoint);
    return response.data;
  }
}
