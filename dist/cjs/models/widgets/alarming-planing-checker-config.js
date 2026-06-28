"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmPlanningCheckerConfig = exports.AlarmPlanningCheckerConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.AlarmPlanningCheckerConfigVersion = '1';
class AlarmPlanningCheckerConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.AlarmingPlanID = [];
        this.version = exports.AlarmPlanningCheckerConfigVersion;
    }
}
exports.AlarmPlanningCheckerConfig = AlarmPlanningCheckerConfig;
