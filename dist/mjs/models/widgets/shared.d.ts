import { CompressionInterval } from '../historical-value.model.js';
export declare abstract class BaseWidgetConfig {
    version: string;
    headerExpanded: boolean;
    title: string;
    constructor();
}
export declare enum ValueEntityType {
    Signal = "Signal",
    Formula = "Formula"
}
export type ValueEntity = {
    id: string;
    type: ValueEntityType;
    valueInterval?: CompressionInterval;
};
export declare class TimeManagementSettings {
    channels: string[];
    enabled: boolean;
    timecontrol: boolean;
    constructor();
}
export declare enum ObservationPeriodUnits {
    Second = "Second",
    Minute = "Minute",
    Hour = "Hour",
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Quarter = "Quarter",
    Year = "Year"
}
export declare class IntervalSettings {
    periodOfTime: ObservationPeriodUnits;
    amountOfTimePeriods: number;
    beginningOfaDay: string;
    beginningOfaWeek: number;
    offsetPeriod?: ObservationPeriodUnits;
    offsetOfTimePeriods?: number;
    delayPeriod?: ObservationPeriodUnits;
    amountOfDelayPeriods?: number;
    constructor();
}
export type ISeriesLineType = 'Stroke' | 'Dashed' | 'Dotted';
export declare enum SeriesType {
    StepSeriesOptions = "StepSeriesOptions",
    StepLineSeriesOptions = "StepLineSeriesOptions",
    LineSeriesOptions = "LineSeriesOptions",
    SmoothedLineSeriesOptions = "SmoothedLineSeriesOptions",
    ColumnSeriesOptions = "ColumnSeriesOptions"
}
export declare class SeriesOptions {
    seriesType: SeriesType;
    name: string;
    associateYAxis: string;
    bulletColor?: string;
    minBullet?: boolean;
    maxBullet?: boolean;
    averageBullet?: boolean;
    minRange?: boolean;
    maxRange?: boolean;
    averageRange?: boolean;
    axisRange?: boolean;
    color?: string;
    customLegend?: string;
    customUnit?: string;
    decimalPlaces?: number;
    tooltipDisabled?: boolean;
    thickness?: number;
    seriesLineType?: ISeriesLineType;
    showBullets?: boolean;
    valueY: string;
    valueX: string;
    hidden?: boolean;
}
export declare class StepLineSeriesOptions extends SeriesOptions {
    startLocation?: number;
}
export interface TensionOptions {
    tensionX?: number;
    tensionY?: number;
}
export declare class LineSeriesOptions extends SeriesOptions {
    tension: TensionOptions;
}
export declare class ColumnSeriesOptions extends SeriesOptions {
    renderInside?: boolean;
}
export declare class AxisOptions {
    name: string;
    label: string;
    color?: string;
    valueX: string;
    valueY: string;
    oppositeSide?: boolean;
}
export declare class GuidelineOptions {
    associatedAxis: string;
    width: number;
    color: string;
    label: string;
    value: number;
    aboveSeries: boolean;
}
export declare class ValueAxisOptions extends AxisOptions {
    unit: string;
    enabled?: boolean;
    decimalPlaces: number;
    inversed: boolean;
    axisPrecision: number;
    minimum?: number;
    maximum?: number;
    [propName: string]: any;
    constructor();
}
export declare class XYChartConfig {
    title?: string;
    name?: string;
    hideName?: boolean;
    isMobile?: boolean;
    hideScrollBars?: boolean;
    hideHeadline?: boolean;
    yAxis: ValueAxisOptions[];
    enableScrollbar: boolean;
    enableScrollbarY: boolean;
    enableAnnotation: boolean;
    smallLegend: boolean;
    legend: boolean;
    tooltipDisabled: boolean;
    showAggregationBullets: boolean;
    showAggregationGuidelines: boolean;
    showTimeRange: boolean;
    series: SeriesOptions[];
    guidelines: GuidelineOptions[];
    bulletDistanceThreshold: number;
    constructor();
}
