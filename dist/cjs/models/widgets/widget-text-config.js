"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetTextConfig = exports.WidgetTextConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetTextConfigVersion = '1';
class WidgetTextConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = '1';
        this.headerExpanded = false;
    }
}
exports.WidgetTextConfig = WidgetTextConfig;
