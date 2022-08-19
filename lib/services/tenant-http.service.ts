import axios from 'axios';
import { Observable } from 'rxjs';
import { HttpConfig } from '../models/http-config.model.js';
import { TenantView } from '../models/tenant-view.model.js';
import { BaseHttpService } from './base-http.service.js';

export class TenantHttpService extends BaseHttpService {
  constructor(httpConfig: HttpConfig, accessToken: string | Promise<string>) {
    super(httpConfig, accessToken);
  }

  public async getTenantViewById(id: string): Promise<TenantView> {
    const url = `${this.getStructureUrl()}/tenant/${id}/view`;
    const headers = this.getAuthorizationHeader();
    const response = await axios.get<TenantView>(url, { headers: headers });
    return response.data;
  }

  public async getTopTenants(): Promise<TenantView[]> {
    const url = `${this.getStructureUrl()}/tenant/top`;
    const headers = this.getAuthorizationHeader();
    const response = await axios.get<TenantView[]>(url, { headers: headers });
    return response.data;
  }

  public async getNextTenants(tenantId: string): Promise<TenantView[]> {
    const url = `${this.getStructureUrl()}/tenant/${tenantId}/next`;
    const headers = this.getAuthorizationHeader();
    const response = await axios.get<TenantView[]>(url, { headers: headers });
    return response.data;
  }
}
