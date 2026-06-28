import { BaseWidgetConfig } from './shared.js';
export declare const WidgetSignalListMixedConfigVersion = "5";
export type SortDirection = 'asc' | 'desc' | '';
export declare class SignalListGroup {
    signalIds: string[];
    id: string;
    name: string;
    expanded: boolean;
    defaultSort: string;
    defaultSortOrder: SortDirection;
}
export declare class WidgetSignalListMixedConfig extends BaseWidgetConfig {
    headerElements: string[];
    groups: SignalListGroup[];
    intervalThresholds: {
        signalId: string;
        threshold: number;
        deactivatedIntervall: boolean;
    }[];
    constructor();
}
