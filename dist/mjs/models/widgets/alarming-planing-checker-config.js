import { BaseWidgetConfig } from './shared.js';
export const AlarmPlanningCheckerConfigVersion = '1';
export class AlarmPlanningCheckerConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.AlarmingPlanID = [];
        this.version = AlarmPlanningCheckerConfigVersion;
    }
}
