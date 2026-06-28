"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetResettableCounterConfig = exports.WidgetResettableCounterConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetResettableCounterConfigVersion = '1';
class WidgetResettableCounterConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetResettableCounterConfigVersion;
    }
}
exports.WidgetResettableCounterConfig = WidgetResettableCounterConfig;
