export declare class TenantView {
    Id: string;
    Name: string;
    Description: string;
    Root: string;
    Enabled: boolean;
    Locked: boolean;
    Public: boolean;
    ApplicationSettings: {
        [p: string]: any;
    };
    constructor(options?: Partial<TenantView>);
}
