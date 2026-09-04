import axios from 'axios';
import { ApiContext, requestHttpConfig } from '../api/api-context.js';
import { ApiVersionInfo } from '../api/api-version.js';
import { Endpoint, ResolvedEndpoint } from '../compat/endpoints/endpoint-resolver.js';
import { HttpConfig } from '../models/http-config.model.js';
import { V4_VERSION_PATH, V5_VERSION_PATH } from '../api/version-detection.js';

export abstract class BaseHttpService {
  protected ctx: ApiContext;

  /**
   * @param ctx Context of the target system.
   */
  constructor(ctx: ApiContext) {
    this.ctx = ctx;
  }

  /** `HttpConfig` of the target system. */
  protected getHttpConfig(): Promise<HttpConfig> {
    return this.ctx.getHttpConfig();
  }

  /** Detected platform version of the target system. */
  public getVersionInfo(): Promise<ApiVersionInfo> {
    return this.ctx.getVersionInfo();
  }

  /** Resolves an endpoint for the detected API version. */
  protected resolve(endpoint: Endpoint): Promise<ResolvedEndpoint> {
    return this.ctx.resolve(endpoint);
  }

  protected getAuthorizationHeader(): Promise<{ [p: string]: string }> {
    return this.ctx.getAuthorizationHeader();
  }

  protected getAccessToken(): Promise<string> {
    return this.ctx.getAccessToken();
  }

  public static requestHttpConfig(systemUrl: string): Promise<HttpConfig> {
    return requestHttpConfig(systemUrl);
  }

  /**
   * Probes the anonymous version endpoint. The v1 path is tried first: with the legacy proxy
   * rewrite disabled the pre-v1 path falls through to the UI catch-all and answers HTML 200,
   * which would be a false positive (docs/analysis/v4-to-v5-endpoints.md section 5).
   */
  public static async isApiReachable(apiUrl: string): Promise<boolean> {
    const base = (apiUrl || '').replace(/\/+$/, '');

    for (const path of [V5_VERSION_PATH, V4_VERSION_PATH]) {
      try {
        const response = await axios.get(`${base}${path}`, {
          responseType: 'text',
          transformResponse: [(data: any) => data],
        });
        const body = typeof response.data === 'string' ? response.data.trim() : '';
        if (response.status === 200 && !body.startsWith('<')) {
          return true;
        }
      } catch (error) {
        if ((error as any)?.response?.status === 401) {
          return true;
        }
      }
    }

    return false;
  }
}
