import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings, XYChartConfig } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export declare const WidgetBasicXyChartConfigVersion = "7";
export declare class WidgetBasicXyChartConfig extends BaseWidgetConfig {
    dataSettings: DataSetting[];
    historicalSetting: IntervalSettings;
    chartConfig: XYChartConfig;
    timeManagementSettings: TimeManagementSettings;
    liveDataSettings: Partial<IXYChartLiveDataSettings>;
    constructor();
}
export interface DataSetting {
    objectId: string;
    dataType: 'Signal' | 'Formula';
    compressionInterval: CompressionInterval;
}
export interface IXYChartLiveDataSettings {
    displayTimeRange: number;
    startupType: boolean;
    enabled: boolean;
    autoZoom: boolean;
}
