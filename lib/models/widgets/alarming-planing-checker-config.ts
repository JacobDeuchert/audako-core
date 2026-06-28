import { BaseWidgetConfig } from './shared.js';

export const AlarmPlanningCheckerConfigVersion = '1';

export class AlarmPlanningCheckerConfig extends BaseWidgetConfig {
  AlarmingPlanID: string[];

  constructor() {
    super();
    this.AlarmingPlanID = [];
    this.version = AlarmPlanningCheckerConfigVersion;
  }
}
