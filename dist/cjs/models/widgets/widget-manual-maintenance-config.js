"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetManualMaintenanceConfig = exports.WidgetManualMaintenanceConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetManualMaintenanceConfigVersion = '1';
class WidgetManualMaintenanceConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetManualMaintenanceConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetManualMaintenanceConfig = WidgetManualMaintenanceConfig;
