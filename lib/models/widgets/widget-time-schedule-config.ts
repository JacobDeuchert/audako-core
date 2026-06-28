import { BaseWidgetConfig } from './shared.js';

export const WidgetTimeScheduleConfigVersion = '1';

export class WidgetTimeScheduleConfig extends BaseWidgetConfig {
  SwitchSchedule: string;

  constructor() {
    super();
    this.version = WidgetTimeScheduleConfigVersion;
  }
}
