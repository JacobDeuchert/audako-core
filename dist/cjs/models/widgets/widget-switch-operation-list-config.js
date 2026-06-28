"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSwitchOperationListConfig = exports.WidgetSwitchOperationListConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetSwitchOperationListConfigVersion = '1';
class WidgetSwitchOperationListConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetSwitchOperationListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetSwitchOperationListConfig = WidgetSwitchOperationListConfig;
