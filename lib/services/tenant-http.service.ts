import axios from 'axios';
import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

export class TenantHttpService extends BaseHttpService {
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>) {
    super(httpConfig, accessToken);
  }

  public async getTenantViewById(id: string): Promise<TenantView> {
    const url = `${await this.getStructureUrl()}/tenant/${id}/view`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.get<TenantView>(url, { headers: headers });
    return response.data;
  }

  public async getTopTenants(): Promise<TenantView[]> {
    const url = `${await this.getStructureUrl()}/tenant/top`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.get<TenantView[]>(url, { headers: headers });
    return response.data;
  }

  public async getNextTenants(tenantId: string): Promise<TenantView[]> {
    const url = `${await this.getStructureUrl()}/tenant/${tenantId}/next`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.get<TenantView[]>(url, { headers: headers });
    return response.data;
  }

  public async filterTenantsByName(name: string): Promise<TenantView[]> {
    const url = `${await this.getStructureUrl()}/tenant/filter/${name}`;
    const headers = await this.getAuthorizationHeader();
    const response = await axios.get<TenantView[]>(url, { headers: headers });
    return response.data;
  }
}
