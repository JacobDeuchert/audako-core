"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetCounterManagementConfig = exports.WidgetCounterManagementConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetCounterManagementConfigVersion = '1';
class WidgetCounterManagementConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetCounterManagementConfigVersion;
        this.counterSignalIds = [];
    }
}
exports.WidgetCounterManagementConfig = WidgetCounterManagementConfig;
