"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetCameraConfig = exports.WidgetCameraConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetCameraConfigVersion = '1';
class WidgetCameraConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetCameraConfigVersion;
    }
}
exports.WidgetCameraConfig = WidgetCameraConfig;
