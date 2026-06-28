import { BaseWidgetConfig } from './shared.js';
export declare const WidgetSwitchOperationListConfigVersion = "1";
export declare class WidgetSwitchOperationListConfig extends BaseWidgetConfig {
    selectedSwitchSchedule: string;
    constructor(options?: Partial<WidgetSwitchOperationListConfig>);
}
