import { BaseWidgetConfig } from './shared.js';
export declare const WidgetGaugeChartConfigVersion = "2";
export declare enum GaugeValueObjectType {
    Signal = "Signal",
    Formula = "Formula"
}
export interface GaugeChartColorRange {
    StartValue?: number;
    EndValue?: number;
    Position?: number;
    Fraction?: number;
    Color: string;
}
export interface GaugeChartConfig {
    Min: number;
    Max: number;
    StartAngle: number;
    EndAngle: number;
    ColorRanges: GaugeChartColorRange[];
    HandColor: string;
    ManualMax: boolean;
    DisplayValue: boolean;
    ManualMin: boolean;
    DecimalPlaces?: number;
    Unit?: number;
    Gradation?: boolean;
    ManageConditions?: boolean;
    IncludeSignalHist?: boolean;
}
export declare class WidgetGaugeChartConfig extends BaseWidgetConfig {
    DataId: string;
    DataType: GaugeValueObjectType;
    ChartConfig: GaugeChartConfig;
    constructor();
}
interface Range {
    start: number;
    end: number;
    rotation: number;
    icon: string;
    inverted?: boolean;
}
export declare const GaugeRange: {
    [key: string]: Range;
};
export declare function GetRangeKey(start: number, end: number): string;
export declare function GetGaugeRotationByKey(key: string): number;
export declare function GetGaugeInvertByKey(key: string): boolean;
export {};
