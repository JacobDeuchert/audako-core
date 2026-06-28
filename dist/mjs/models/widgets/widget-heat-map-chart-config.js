import { BaseWidgetConfig } from './shared.js';
export const WidgetHeatMapChartConfigVersion = '2';
export class HeatMapCategoryAxisOptions {
}
export class HeatMapColumnSeriesOptions {
}
export class HeatMapChartConfig {
}
export class WidgetHeatMapChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetHeatMapChartConfigVersion;
    }
}
