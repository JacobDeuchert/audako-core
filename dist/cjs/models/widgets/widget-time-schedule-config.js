"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetTimeScheduleConfig = exports.WidgetTimeScheduleConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetTimeScheduleConfigVersion = '1';
class WidgetTimeScheduleConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetTimeScheduleConfigVersion;
    }
}
exports.WidgetTimeScheduleConfig = WidgetTimeScheduleConfig;
