"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmPlanningConfig = exports.AlarmPlanningConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.AlarmPlanningConfigVersion = '2';
class AlarmPlanningConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.ReferenceId = '';
        this.sidebarExpandedOnLargeWidget = false;
        this.version = exports.AlarmPlanningConfigVersion;
    }
}
exports.AlarmPlanningConfig = AlarmPlanningConfig;
