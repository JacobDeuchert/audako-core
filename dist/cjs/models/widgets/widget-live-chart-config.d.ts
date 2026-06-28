import { BaseWidgetConfig, XYChartConfig } from './shared.js';
export interface TimeFrame {
    Hours: number;
    Minutes: number;
}
export declare const WidgetLiveChartConfigVersion = "1";
export declare class WidgetLiveChartConfig extends BaseWidgetConfig {
    chartConfig: XYChartConfig;
    signals: string[];
    timeFrame: TimeFrame;
    autoZoom: boolean;
    constructor();
}
