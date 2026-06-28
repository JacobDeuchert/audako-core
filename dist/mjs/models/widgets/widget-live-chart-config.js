import { BaseWidgetConfig, XYChartConfig } from './shared.js';
export const WidgetLiveChartConfigVersion = '1';
export class WidgetLiveChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.signals = [];
        this.chartConfig = new XYChartConfig();
    }
}
