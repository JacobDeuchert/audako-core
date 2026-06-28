import { BaseWidgetConfig } from './shared.js';

export enum WidgetEventListFilterType {
  Group = 'Group',
  EventCategory = 'EventCategory',
  EventDefinition = 'EventDefinition',
}

export enum WidgetEventListFilterTypeTranslation {
  Group = 'GROUP',
  EventCategory = 'EVENTCATEGORY',
  EventDefinition = 'EVENTDEFINITION',
}

export interface Sort {
  active: string;
  direction: 'asc' | 'desc' | '';
}

export const WidgetEventListConfigVersion = '1';

export class WidgetEventListConfig extends BaseWidgetConfig {
  filterType: WidgetEventListFilterType;
  filteredEntities: string[];
  withSubGroups: boolean;

  defaultSort: Sort;

  constructor(options?: Partial<WidgetEventListConfig>) {
    super();

    this.version = WidgetEventListConfigVersion;

    if (options) {
      Object.assign(this, options);
    }
  }
}
