import { BaseWidgetConfig } from './shared.js';
export declare const WidgetEnteredEventConfigVersion = "2";
export declare class WidgetEnteredEventConfig extends BaseWidgetConfig {
    filterType: string;
    selectedFilter: string[];
    onlyActive: boolean;
    requestIntervalType: RequestIntervalType;
    requestInterval: number;
    filterWithSubgroup: boolean;
    constructor(options?: Omit<Partial<WidgetEnteredEventConfig>, 'version'>);
}
export declare enum RequestIntervalType {
    Seconds = "Seconds",
    Minutes = "Minutes"
}
