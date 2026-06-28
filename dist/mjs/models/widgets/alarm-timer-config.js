import { BaseWidgetConfig } from './shared.js';
export const AlarmTimerConfigVersion = '1';
export class AlarmTimerConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.alarmingPlanIds = [];
        this.version = AlarmTimerConfigVersion;
    }
}
