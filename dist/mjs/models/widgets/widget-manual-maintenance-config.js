import { BaseWidgetConfig } from './shared.js';
export const WidgetManualMaintenanceConfigVersion = '1';
export class WidgetManualMaintenanceConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetManualMaintenanceConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
