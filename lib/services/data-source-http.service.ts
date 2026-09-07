import { ApiContext } from '../api/api-context.js';

/**
 * Driver job started by a command endpoint. v5 answers the configure command with
 * `ConfigureDataSourceResponse {JobId, Timestamp}`; v4 answered with an empty body, so v4 calls
 * resolve to `null`.
 */
export interface DriverJobInfo {
  JobId: string;
  Timestamp?: string;
}

export class DataSourceHttpService {
  constructor(public readonly ctx: ApiContext) {}

  /**
   * Tells the driver to (re-)configure a data source.
   *
   * Returns the started driver job on v5 and `null` on v4, which answers with an empty body.
   */
  public async configureDataSource(dataSourceId: string): Promise<DriverJobInfo | null> {
    const response = await this.ctx.request<DriverJobInfo | null>({
      name: 'driverConfigureDataSource',
      dataSourceId: dataSourceId,
    });
    const data: any = response.data;

    if (!data || typeof data !== 'object' || !data.JobId) {
      return null;
    }

    return { JobId: data.JobId, Timestamp: data.Timestamp };
  }
}
