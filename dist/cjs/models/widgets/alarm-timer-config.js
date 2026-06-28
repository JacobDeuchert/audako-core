"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmTimerConfig = exports.AlarmTimerConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.AlarmTimerConfigVersion = '1';
class AlarmTimerConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.alarmingPlanIds = [];
        this.version = exports.AlarmTimerConfigVersion;
    }
}
exports.AlarmTimerConfig = AlarmTimerConfig;
