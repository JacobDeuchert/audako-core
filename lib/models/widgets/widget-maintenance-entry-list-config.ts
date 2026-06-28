import { BaseWidgetConfig } from './shared.js';

export enum MaintEntryState {
  Ongoing = 'Ongoing',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export const WidgetMaintenanceEntryListConfigVersion = '2';

export class WidgetMaintenanceEntryListConfig extends BaseWidgetConfig {
  StateFilter: MaintEntryState[];

  ServiceFilterType: ServiceFilterType;
  ServiceFilterIds: string[];

  constructor(options?: Partial<WidgetMaintenanceEntryListConfig>) {
    super();
    this.version = WidgetMaintenanceEntryListConfigVersion;

    if (options) {
      Object.assign(this, options);
    }
  }
}

export enum EntryListViewType {
  Open = 'Open',
  History = 'History',
  All = 'All',
}

export enum ServiceFilterType {
  Group = 'Group',
  Service = 'Service',
}
