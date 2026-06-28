"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSetpointTableConfig = exports.WidgetSetpointTableConfigVersion = exports.SetPointStatus = void 0;
const shared_js_1 = require("./shared.js");
var SetPointStatus;
(function (SetPointStatus) {
    SetPointStatus["Enabled"] = "Enabled";
    SetPointStatus["Disabled"] = "Disabled";
    SetPointStatus["Locked"] = "Locked";
})(SetPointStatus || (exports.SetPointStatus = SetPointStatus = {}));
exports.WidgetSetpointTableConfigVersion = '0';
class WidgetSetpointTableConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.dataGroups = [];
        this.version = exports.WidgetSetpointTableConfigVersion;
    }
}
exports.WidgetSetpointTableConfig = WidgetSetpointTableConfig;
