"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetEventTestConfig = exports.WidgetEventTestConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetEventTestConfigVersion = '1';
class WidgetEventTestConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.Events = [];
        this.version = exports.WidgetEventTestConfigVersion;
    }
}
exports.WidgetEventTestConfig = WidgetEventTestConfig;
