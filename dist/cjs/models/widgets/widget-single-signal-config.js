"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSingleSignalConfig = exports.WidgetSingleSignalConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetSingleSignalConfigVersion = '1';
class WidgetSingleSignalConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetSingleSignalConfigVersion;
        this.signalId = '';
        this.selectedIcon = '';
    }
}
exports.WidgetSingleSignalConfig = WidgetSingleSignalConfig;
