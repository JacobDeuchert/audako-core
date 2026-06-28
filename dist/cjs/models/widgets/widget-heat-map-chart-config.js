"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetHeatMapChartConfig = exports.HeatMapChartConfig = exports.HeatMapColumnSeriesOptions = exports.HeatMapCategoryAxisOptions = exports.WidgetHeatMapChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetHeatMapChartConfigVersion = '2';
class HeatMapCategoryAxisOptions {
}
exports.HeatMapCategoryAxisOptions = HeatMapCategoryAxisOptions;
class HeatMapColumnSeriesOptions {
}
exports.HeatMapColumnSeriesOptions = HeatMapColumnSeriesOptions;
class HeatMapChartConfig {
}
exports.HeatMapChartConfig = HeatMapChartConfig;
class WidgetHeatMapChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetHeatMapChartConfigVersion;
    }
}
exports.WidgetHeatMapChartConfig = WidgetHeatMapChartConfig;
