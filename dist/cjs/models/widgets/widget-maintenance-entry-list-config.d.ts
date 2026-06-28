import { BaseWidgetConfig } from './shared.js';
export declare enum MaintEntryState {
    Ongoing = "Ongoing",
    Canceled = "Canceled",
    Completed = "Completed"
}
export declare const WidgetMaintenanceEntryListConfigVersion = "2";
export declare class WidgetMaintenanceEntryListConfig extends BaseWidgetConfig {
    StateFilter: MaintEntryState[];
    ServiceFilterType: ServiceFilterType;
    ServiceFilterIds: string[];
    constructor(options?: Partial<WidgetMaintenanceEntryListConfig>);
}
export declare enum EntryListViewType {
    Open = "Open",
    History = "History",
    All = "All"
}
export declare enum ServiceFilterType {
    Group = "Group",
    Service = "Service"
}
