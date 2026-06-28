"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChartConfig = exports.WidgetPieChartConfig = exports.WidgetPieChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
const historical_value_model_js_1 = require("../historical-value.model.js");
exports.WidgetPieChartConfigVersion = '5';
class WidgetPieChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.unit = '';
        this.version = exports.WidgetPieChartConfigVersion;
        this.compressionSettings = historical_value_model_js_1.CompressionInterval.DayInterval;
        this.historicalSetting = new shared_js_1.IntervalSettings();
        this.timeManagementSettings = new shared_js_1.TimeManagementSettings();
        this.headerExpanded = false;
    }
}
exports.WidgetPieChartConfig = WidgetPieChartConfig;
class PieChartConfig {
}
exports.PieChartConfig = PieChartConfig;
