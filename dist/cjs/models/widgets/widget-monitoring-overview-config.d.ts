import { BaseWidgetConfig } from './shared.js';
export declare const WidgetMonitoringOverviewConfigVersion = "1";
export declare class WidgetMonitoringOverviewConfig extends BaseWidgetConfig {
    filterType: string;
    selectedFilter: string[];
    filterWithSubgroup: boolean;
    constructor(options?: Omit<Partial<WidgetMonitoringOverviewConfig>, 'version'>);
}
