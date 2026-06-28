"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMonitoringOverviewConfig = exports.WidgetMonitoringOverviewConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetMonitoringOverviewConfigVersion = '1';
class WidgetMonitoringOverviewConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetMonitoringOverviewConfigVersion;
        this.filterType = 'Group';
        this.selectedFilter = [];
        this.filterWithSubgroup = false;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetMonitoringOverviewConfig = WidgetMonitoringOverviewConfig;
