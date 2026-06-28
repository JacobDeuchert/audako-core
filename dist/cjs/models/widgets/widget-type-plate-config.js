"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetTypePlateConfig = exports.WidgetTypePlateConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetTypePlateConfigVersion = '1';
class WidgetTypePlateConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetTypePlateConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetTypePlateConfig = WidgetTypePlateConfig;
