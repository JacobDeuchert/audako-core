import { BaseWidgetConfig } from './shared.js';
export declare const WidgetManualMaintenanceConfigVersion = "1";
export declare class WidgetManualMaintenanceConfig extends BaseWidgetConfig {
    serviceIds: string[];
    constructor(options?: Partial<WidgetManualMaintenanceConfig>);
}
