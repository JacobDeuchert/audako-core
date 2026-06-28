import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export const WidgetPieChartConfigVersion = '5';
export class WidgetPieChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.unit = '';
        this.version = WidgetPieChartConfigVersion;
        this.compressionSettings = CompressionInterval.DayInterval;
        this.historicalSetting = new IntervalSettings();
        this.timeManagementSettings = new TimeManagementSettings();
        this.headerExpanded = false;
    }
}
export class PieChartConfig {
}
