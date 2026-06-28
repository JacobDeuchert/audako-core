import { BaseWidgetConfig } from './shared.js';
export declare const AlarmTimerConfigVersion = "1";
export declare class AlarmTimerConfig extends BaseWidgetConfig {
    alarmingPlanIds: string[];
    offset: number;
    constructor();
}
