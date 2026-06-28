import { BaseWidgetConfig } from './shared.js';
export declare const WidgetSingleSignalConfigVersion = "1";
export declare class WidgetSingleSignalConfig extends BaseWidgetConfig {
    signalId: string;
    selectedIcon: string;
    manageConditions: boolean;
    includeSignalHist: boolean;
    constructor();
}
