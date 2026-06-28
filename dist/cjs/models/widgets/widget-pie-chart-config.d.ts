import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export declare const WidgetPieChartConfigVersion = "5";
export declare class WidgetPieChartConfig extends BaseWidgetConfig {
    dataSettings: PieChartDataSettings[];
    compressionSettings: CompressionInterval;
    historicalSetting: IntervalSettings;
    chartConfig: PieChartConfig;
    timeManagementSettings: TimeManagementSettings;
    unit: string;
    constructor();
}
export interface PieChartDataSettings {
    entityId: string;
    available: boolean;
    aggregation: number;
    label: string;
    color: string;
    unit: string;
    entityType?: 'Signal' | 'Formula';
}
export declare class PieChartConfig {
    title: string;
    legendSettings: LegendSettings;
    series: PieSeriesOptions[];
    innerRadius: number;
    endAngle: number;
    startAngle: number;
    groupingEnabled: boolean;
    groupingThreshold?: number;
    groupingName: string;
    radius?: number;
}
export interface LegendSettings {
    visible: boolean;
}
export interface PieSeriesOptions {
    decimalPlaces?: number;
    unit?: string;
    radius?: number;
    value: string;
    category: string;
    disableLabels?: boolean;
    textFormat?: string;
}
