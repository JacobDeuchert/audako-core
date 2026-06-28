"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnteredAlarmingIntervalType = exports.WidgetEnteredAlarmingConfig = exports.WidgetEnteredAlarmingConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetEnteredAlarmingConfigVersion = '2';
class WidgetEnteredAlarmingConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetEnteredAlarmingConfigVersion;
        this.DateIntervalType = EnteredAlarmingIntervalType.Day;
        this.filterType = 'Group';
        this.selectedFilter = [];
        this.filterWithSubgroup = false;
    }
}
exports.WidgetEnteredAlarmingConfig = WidgetEnteredAlarmingConfig;
var EnteredAlarmingIntervalType;
(function (EnteredAlarmingIntervalType) {
    EnteredAlarmingIntervalType["Day"] = "Day";
    EnteredAlarmingIntervalType["Week"] = "Week";
    EnteredAlarmingIntervalType["Month"] = "Month";
})(EnteredAlarmingIntervalType || (exports.EnteredAlarmingIntervalType = EnteredAlarmingIntervalType = {}));
