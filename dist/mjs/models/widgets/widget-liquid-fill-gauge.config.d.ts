import { BaseWidgetConfig } from './shared.js';
export declare const WidgetLiquidFillGaugeConfigVersion = "1";
export declare class WidgetLiquidFillGaugeConfig extends BaseWidgetConfig {
    gaugeTitle: string;
    minValue: number;
    maxValue: number;
    suffix: string;
    displaySuffix: boolean;
    waveCount: number;
    circleThickness: number;
    circleFillGap: number;
    animateWave: boolean;
    waveColor: string;
    circleColor: string;
    textColor: string;
    waveTextColor: string;
    signalId: string;
    waveAnimateTime: number;
    waveHeight: number;
    showMinMax: boolean;
    showNullLine: boolean;
    animationSignal: string;
    animationSignalState: boolean;
    manageConditions: boolean;
    includeSignalHist: boolean;
    constructor();
}
