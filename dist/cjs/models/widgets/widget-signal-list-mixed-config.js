"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSignalListMixedConfig = exports.SignalListGroup = exports.WidgetSignalListMixedConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetSignalListMixedConfigVersion = '5';
class SignalListGroup {
    constructor() {
        this.expanded = true;
    }
}
exports.SignalListGroup = SignalListGroup;
class WidgetSignalListMixedConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetSignalListMixedConfigVersion;
    }
}
exports.WidgetSignalListMixedConfig = WidgetSignalListMixedConfig;
