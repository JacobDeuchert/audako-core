import { ApiContext } from '../api/api-context.js';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { Endpoint } from '../compat/endpoints/endpoint-resolver.js';
import { BaseHttpService } from './base-http.service.js';

export class TenantHttpService extends BaseHttpService {
  /**
   * @param ctx Context of the target system.
   */
  constructor(ctx: ApiContext);
  /**
   * @deprecated Pass an `ApiContext` instead.
   */
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
  constructor(httpConfigOrCtx: ApiContext | AsyncValue<HttpConfig>, accessToken?: AsyncValue<string>) {
    super(httpConfigOrCtx as any, accessToken as any);
  }

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
