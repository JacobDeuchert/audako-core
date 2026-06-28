import { BaseWidgetConfig } from './shared.js';
import { RequestIntervalType } from './widget-entered-event-config.js';

export const WidgetEnteredAlarmingConfigVersion = '2';

export class WidgetEnteredAlarmingConfig extends BaseWidgetConfig {
  filterType: string;
  selectedFilter: string[];
  filterWithSubgroup: boolean;
  requestInterval: number;
  requestIntervalType: RequestIntervalType;
  DateIntervalType: EnteredAlarmingIntervalType;

  constructor() {
    super();
    this.version = WidgetEnteredAlarmingConfigVersion;
    this.DateIntervalType = EnteredAlarmingIntervalType.Day;
    this.filterType = 'Group';
    this.selectedFilter = [];
    this.filterWithSubgroup = false;
  }
}

export enum EnteredAlarmingIntervalType {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
}
