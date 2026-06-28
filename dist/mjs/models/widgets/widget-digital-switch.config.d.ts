import { BaseWidgetConfig } from './shared.js';
export declare const WidgetDigitalSwitchConfigVersion = "2";
export declare class WidgetDigitalSwitchConfig extends BaseWidgetConfig {
    signalId: string;
    signalLockId: string;
    lockingValue: any;
    customLockingValue: any;
    lockingState: number;
    displayStatus: boolean;
    caption: string;
    type: string;
    manageConditions: boolean;
    includeSignalHist: boolean;
    constructor();
}
