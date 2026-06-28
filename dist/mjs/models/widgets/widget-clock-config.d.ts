import { BaseWidgetConfig } from './shared.js';
export declare const WidgetClockConfigVersion = "1";
export declare class WidgetClockConfig extends BaseWidgetConfig {
    clockType: ClockType;
    date: boolean;
    timezone: number;
    seconds: boolean;
    constructor();
}
export declare enum ClockType {
    Digital = "Digital",
    Analog = "Analog"
}
