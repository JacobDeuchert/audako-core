import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings, XYChartConfig, } from './shared.js';
export const WidgetBasicXyChartConfigVersion = '7';
export class WidgetBasicXyChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetBasicXyChartConfigVersion;
        this.dataSettings = [];
        this.historicalSetting = new IntervalSettings();
        this.chartConfig = new XYChartConfig();
        this.timeManagementSettings = new TimeManagementSettings();
        this.liveDataSettings = {
            displayTimeRange: 0,
            startupType: false,
            enabled: false,
            autoZoom: false,
        };
    }
}
