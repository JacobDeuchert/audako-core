import { BaseWidgetConfig } from './shared.js';

export const WidgetMonitoringOverviewConfigVersion = '1';

export class WidgetMonitoringOverviewConfig extends BaseWidgetConfig {
  filterType: string;
  selectedFilter: string[];
  filterWithSubgroup: boolean;

  constructor(options?: Omit<Partial<WidgetMonitoringOverviewConfig>, 'version'>) {
    super();
    this.version = WidgetMonitoringOverviewConfigVersion;
    this.filterType = 'Group';
    this.selectedFilter = [];
    this.filterWithSubgroup = false;

    if (options) {
      Object.assign(this, options);
    }
  }
}
