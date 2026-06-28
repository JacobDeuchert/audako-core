"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetLiveModeConfig = exports.WidgetLiveModeConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetLiveModeConfigVersion = '2';
class WidgetLiveModeConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.title = '';
        this.queryType = null;
        this.version = exports.WidgetLiveModeConfigVersion;
    }
}
exports.WidgetLiveModeConfig = WidgetLiveModeConfig;
