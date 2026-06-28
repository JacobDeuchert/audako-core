"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSankeyChartConfig = exports.SankeyChartWidgetFormAggregationTypes = exports.WidgetSankeyChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
const historical_value_model_js_1 = require("../historical-value.model.js");
exports.WidgetSankeyChartConfigVersion = '2';
var SankeyChartWidgetFormAggregationTypes;
(function (SankeyChartWidgetFormAggregationTypes) {
    SankeyChartWidgetFormAggregationTypes["Sum"] = "Sum";
    SankeyChartWidgetFormAggregationTypes["Average"] = "Average";
})(SankeyChartWidgetFormAggregationTypes || (exports.SankeyChartWidgetFormAggregationTypes = SankeyChartWidgetFormAggregationTypes = {}));
class WidgetSankeyChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.unit = '';
        this.nodes = [];
        this.connections = [];
        this.version = exports.WidgetSankeyChartConfigVersion;
        this.timeManagementSettings = new shared_js_1.TimeManagementSettings();
        this.compressionSettings = historical_value_model_js_1.CompressionInterval.DayInterval;
    }
}
exports.WidgetSankeyChartConfig = WidgetSankeyChartConfig;
