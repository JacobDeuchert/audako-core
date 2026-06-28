import { BaseWidgetConfig } from './shared.js';
export declare const WidgetResettableCounterConfigVersion = "1";
export declare class WidgetResettableCounterConfig extends BaseWidgetConfig {
    SignalId: string;
    Icon: string;
    manageConditions: boolean;
    includeSignalHist: boolean;
    constructor();
}
