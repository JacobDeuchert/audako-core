import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export declare const WidgetHeatMapChartConfigVersion = "2";
export declare class HeatMapCategoryAxisOptions {
    category: string;
}
export declare class HeatMapColumnSeriesOptions {
    customUnit?: string;
    borderRadius?: number;
    decimalPlaces?: number;
}
export declare class HeatMapChartConfig {
    xAxis: HeatMapCategoryAxisOptions;
    yAxis: HeatMapCategoryAxisOptions;
    series: HeatMapColumnSeriesOptions;
    minColor: string;
    maxColor: string;
    title: string;
}
export declare class WidgetHeatMapChartConfig extends BaseWidgetConfig {
    chartConfig: HeatMapChartConfig;
    dataSettings: HeatMapDataSettings;
    historicalSetting: IntervalSettings;
    timeManagementSettings: TimeManagementSettings;
    constructor();
}
export interface HeatMapDataSettings {
    signalId: string;
    compressionInterval: CompressionInterval;
}
