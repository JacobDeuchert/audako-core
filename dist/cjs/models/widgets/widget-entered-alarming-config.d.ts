import { BaseWidgetConfig } from './shared.js';
import { RequestIntervalType } from './widget-entered-event-config.js';
export declare const WidgetEnteredAlarmingConfigVersion = "2";
export declare class WidgetEnteredAlarmingConfig extends BaseWidgetConfig {
    filterType: string;
    selectedFilter: string[];
    filterWithSubgroup: boolean;
    requestInterval: number;
    requestIntervalType: RequestIntervalType;
    DateIntervalType: EnteredAlarmingIntervalType;
    constructor();
}
export declare enum EnteredAlarmingIntervalType {
    Day = "Day",
    Week = "Week",
    Month = "Month"
}
