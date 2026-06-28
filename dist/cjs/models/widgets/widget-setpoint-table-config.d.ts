import { BaseWidgetConfig } from './shared.js';
export declare enum SetPointStatus {
    Enabled = "Enabled",
    Disabled = "Disabled",
    Locked = "Locked"
}
export interface SetPointData {
    SignalId: string;
    Label: string;
    Status: SetPointStatus;
    Setpoint: string;
}
export interface SetpointGroup {
    Name: string;
    Id: string;
    Expanded: boolean;
    Data: SetPointData[];
}
export declare const WidgetSetpointTableConfigVersion = "0";
export declare class WidgetSetpointTableConfig extends BaseWidgetConfig {
    dataGroups: SetpointGroup[];
    constructor();
}
