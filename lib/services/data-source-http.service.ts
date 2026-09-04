import { ApiContext } from '../api/api-context.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

/**
 * Driver job started by a command endpoint. v5 answers the configure command with
 * `ConfigureDataSourceResponse {JobId, Timestamp}`; v4 answered with an empty body, so v4 calls
 * resolve to `null`.
 */
export interface DriverJobInfo {
  JobId: string;
  Timestamp?: string;
}

export class DataSourceHttpService extends BaseHttpService {
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

  /**
   * Tells the driver to (re-)configure a data source.
   *
   * Returns the started driver job on v5 and `null` on v4, which answers with an empty body.
   * (Until this change the driver URL was awaited nowhere, so the request went to
   * `[object Promise]/command/...` and could never work.)
   */
  public async sendDatSrcConfiguration(dataSourceId: string): Promise<DriverJobInfo | null> {
    const endpoint = await this.resolve({ name: 'driverConfigureDataSource', dataSourceId: dataSourceId });
    const response = await this.ctx.http.get<DriverJobInfo | null>(endpoint.url);
    const data: any = response.data;

    if (!data || typeof data !== 'object' || !data.JobId) {
      return null;
    }

    return { JobId: data.JobId, Timestamp: data.Timestamp };
  }
}
