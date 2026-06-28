import { BaseWidgetConfig } from './shared.js';
export const WidgetMonitoringOverviewConfigVersion = '1';
export class WidgetMonitoringOverviewConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetMonitoringOverviewConfigVersion;
        this.filterType = 'Group';
        this.selectedFilter = [];
        this.filterWithSubgroup = false;
        if (options) {
            Object.assign(this, options);
        }
    }
}
