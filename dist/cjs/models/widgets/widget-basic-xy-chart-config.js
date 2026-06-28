"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetBasicXyChartConfig = exports.WidgetBasicXyChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetBasicXyChartConfigVersion = '7';
class WidgetBasicXyChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetBasicXyChartConfigVersion;
        this.dataSettings = [];
        this.historicalSetting = new shared_js_1.IntervalSettings();
        this.chartConfig = new shared_js_1.XYChartConfig();
        this.timeManagementSettings = new shared_js_1.TimeManagementSettings();
        this.liveDataSettings = {
            displayTimeRange: 0,
            startupType: false,
            enabled: false,
            autoZoom: false,
        };
    }
}
exports.WidgetBasicXyChartConfig = WidgetBasicXyChartConfig;
