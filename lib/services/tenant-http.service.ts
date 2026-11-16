import { ApiContext } from '../api/api-context.js';
import { Endpoint } from '../compat/endpoints/endpoint-resolver.js';
import { TenantView } from '../models/tenant-view.model.js';
import { TranslatableText } from '../models/translatable-text.model.js';

export class TenantHttpService {
  constructor(public readonly ctx: ApiContext) {}

  public async getTenantViewById(id: string): Promise<TenantView> {
    return tenantViewFromWire(await this._get({ name: 'tenantViewById', tenantId: id }));
  }

  public async getTenantViewForEntityId(entityId: string): Promise<TenantView> {
    return tenantViewFromWire(await this._get({ name: 'tenantViewForEntity', entityId: entityId }));
  }

  public async getTopTenants(): Promise<TenantView[]> {
    return tenantViewsFromWire(await this._get({ name: 'tenantsTop' }));
  }

  public async getNextTenants(tenantId: string): Promise<TenantView[]> {
    return tenantViewsFromWire(await this._get({ name: 'tenantsNext', tenantId: tenantId }));
  }

  public async filterTenantsByName(name: string): Promise<TenantView[]> {
    return tenantViewsFromWire(await this._get({ name: 'tenantsFilter', filter: name }));
  }

  private async _get(endpoint: Endpoint): Promise<any> {
    const response = await this.ctx.request(endpoint);
    return response.data;
  }
}

/**
 * Wire -> canonical `TenantView`. The only difference between the platform lines is the text
 * shape: v4 (and v5 before tenant translations) sends `Name`/`Description` as plain strings,
 * current v5 as `{ Value, Translations }`. Normalized on the payload, not the version, so both
 * shapes are read correctly on any server.
 */
export function tenantViewFromWire(wire: any): TenantView {
  if (!wire || typeof wire !== 'object') {
    return wire;
  }
  return {
    ...wire,
    Name: TranslatableText.from(wire.Name),
    Description: TranslatableText.from(wire.Description),
  };
}

function tenantViewsFromWire(wire: any): TenantView[] {
  return Array.isArray(wire) ? wire.map(tenantViewFromWire) : wire;
}
