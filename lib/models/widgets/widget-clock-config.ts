import { BaseWidgetConfig } from './shared.js';

export const WidgetClockConfigVersion = '1';

export class WidgetClockConfig extends BaseWidgetConfig {
  clockType: ClockType;
  date: boolean;
  timezone: number;
  seconds: boolean;

  constructor() {
    super();
    this.clockType = ClockType.Analog;
    this.version = WidgetClockConfigVersion;
    this.seconds = false;
    this.date = false;
    this.timezone = 0;
  }
}

export enum ClockType {
  Digital = 'Digital',
  Analog = 'Analog',
}
