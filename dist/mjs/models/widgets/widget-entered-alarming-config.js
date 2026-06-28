import { BaseWidgetConfig } from './shared.js';
export const WidgetEnteredAlarmingConfigVersion = '2';
export class WidgetEnteredAlarmingConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetEnteredAlarmingConfigVersion;
        this.DateIntervalType = EnteredAlarmingIntervalType.Day;
        this.filterType = 'Group';
        this.selectedFilter = [];
        this.filterWithSubgroup = false;
    }
}
export var EnteredAlarmingIntervalType;
(function (EnteredAlarmingIntervalType) {
    EnteredAlarmingIntervalType["Day"] = "Day";
    EnteredAlarmingIntervalType["Week"] = "Week";
    EnteredAlarmingIntervalType["Month"] = "Month";
})(EnteredAlarmingIntervalType || (EnteredAlarmingIntervalType = {}));
