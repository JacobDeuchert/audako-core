import { BaseWidgetConfig } from './shared.js';

export const AlarmTimerConfigVersion = '1';

export class AlarmTimerConfig extends BaseWidgetConfig {
  alarmingPlanIds: string[];
  offset: number;

  constructor() {
    super();
    this.alarmingPlanIds = [];
    this.version = AlarmTimerConfigVersion;
  }
}
