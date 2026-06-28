"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetLiveChartConfig = exports.WidgetLiveChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetLiveChartConfigVersion = '1';
class WidgetLiveChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.signals = [];
        this.chartConfig = new shared_js_1.XYChartConfig();
    }
}
exports.WidgetLiveChartConfig = WidgetLiveChartConfig;
