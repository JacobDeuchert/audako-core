/**
 * Contents of `{systemUrl}/assets/conf/application.config`.
 *
 * On v5 the API version moved into the per-service paths (`Structure: '/v1/structure'`) while
 * `Services.BaseUri` still ends in `/api`, and the migration is per service: `Live`,
 * `Maintenance`, `Messenger`, `Ticket`, `Manufacturing`, `Runtime` and `ExternalApi` are still
 * bare v4-style paths. Always build URLs as `BaseUri + Services.<Service>`; never hardcode
 * `/api/v1` (docs/analysis/v4-to-v5-endpoints.md section 5).
 */
export interface HttpConfig {
    Services: {
        BaseUri: string;
        Calendar: string;
        Camera: string;
        Driver: string;
        Event: string;
        Historian: string;
        Live: string;
        Maintenance: string;
        Messenger: string;
        Reporting: string;
        Structure: string;
        /** v5 only. */
        Ticket?: string;
        /** v5 only. */
        Manufacturing?: string;
        /** v5 only. */
        Runtime?: string;
        /** v5 only. */
        ExternalApi?: string;
    } | null;
    Authentication: {
        BaseUri: string;
        ClientId: string;
        RequireHttps?: boolean;
    } | null;
    /** Free-form UI configuration block. Not used by audako-core. */
    Configuration?: {
        [key: string]: any;
    } | null;
    /**
     * Optional exact platform version marker. When present, version detection uses it instead of
     * probing the version endpoint.
     */
    ApiVersion?: string;
}
