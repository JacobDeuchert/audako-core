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
    } | null;
    Authentication: {
        BaseUri: string;
        ClientId: string;
    } | null;
}
