import { BaseWidgetConfig } from './shared.js';
export const AlarmPlanningConfigVersion = '2';
export class AlarmPlanningConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.ReferenceId = '';
        this.sidebarExpandedOnLargeWidget = false;
        this.version = AlarmPlanningConfigVersion;
    }
}
