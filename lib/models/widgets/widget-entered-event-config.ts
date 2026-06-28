import { BaseWidgetConfig } from './shared.js';

export const WidgetEnteredEventConfigVersion = '2';

export class WidgetEnteredEventConfig extends BaseWidgetConfig {
  filterType: string;
  selectedFilter: string[];
  onlyActive: boolean;
  requestIntervalType: RequestIntervalType;
  requestInterval: number;
  filterWithSubgroup: boolean;

  constructor(options?: Omit<Partial<WidgetEnteredEventConfig>, 'version'>) {
    super();
    this.version = WidgetEnteredEventConfigVersion;
    this.filterType = 'Group';
    this.onlyActive = false;
    this.requestIntervalType = RequestIntervalType.Minutes;
    this.requestInterval = 5;
    this.selectedFilter = [];
    this.filterWithSubgroup = false;

    if (options) {
      Object.assign(this, options);
    }
  }
}

export enum RequestIntervalType {
  Seconds = 'Seconds',
  Minutes = 'Minutes',
}
