import { BaseWidgetConfig } from './shared.js';
export declare const WidgetReportConfigVersion = "2";
export declare class WidgetReportConfig extends BaseWidgetConfig {
    reportId: string;
    TemplateTimeSteps: {
        [p: string]: TimeStepSize;
    };
    startTemplate?: string;
    startOffset: number;
    constructor();
}
export declare enum TimeStepSize {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year"
}
export declare const widgetReport_Name: string;
