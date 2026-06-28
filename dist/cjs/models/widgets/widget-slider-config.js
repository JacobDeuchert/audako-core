"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSliderConfig = exports.SliderEntry = exports.WidgetSliderConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetSliderConfigVersion = '0';
class SliderEntry {
    constructor(options) {
        Object.assign(this, options);
    }
}
exports.SliderEntry = SliderEntry;
class WidgetSliderConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetSliderConfigVersion;
        this.sliderGroups = null;
    }
}
exports.WidgetSliderConfig = WidgetSliderConfig;
