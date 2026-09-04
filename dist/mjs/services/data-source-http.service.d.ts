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
export declare class DataSourceHttpService extends BaseHttpService {
    /**
     * Tells the driver to (re-)configure a data source.
     *
     * Returns the started driver job on v5 and `null` on v4, which answers with an empty body.
     * (Until this change the driver URL was awaited nowhere, so the request went to
     * `[object Promise]/command/...` and could never work.)
     */
    sendDatSrcConfiguration(dataSourceId: string): Promise<DriverJobInfo | null>;
}
