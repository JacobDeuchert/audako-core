import { BaseWidgetConfig, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export const WidgetSankeyChartConfigVersion = '2';
export var SankeyChartWidgetFormAggregationTypes;
(function (SankeyChartWidgetFormAggregationTypes) {
    SankeyChartWidgetFormAggregationTypes["Sum"] = "Sum";
    SankeyChartWidgetFormAggregationTypes["Average"] = "Average";
})(SankeyChartWidgetFormAggregationTypes || (SankeyChartWidgetFormAggregationTypes = {}));
export class WidgetSankeyChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.unit = '';
        this.nodes = [];
        this.connections = [];
        this.version = WidgetSankeyChartConfigVersion;
        this.timeManagementSettings = new TimeManagementSettings();
        this.compressionSettings = CompressionInterval.DayInterval;
    }
}
