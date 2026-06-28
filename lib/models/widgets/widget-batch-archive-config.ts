import { BaseWidgetConfig } from './shared.js';

export const WidgetBatchArchiveConfigVersion = '1';

export class WidgetBatchArchiveConfig implements BaseWidgetConfig {
  version: string;
  headerExpanded: boolean;
  title: string;

  filterType: 'Group' | 'BatchDefinition';
  selectedFilter: string[];
  filterWithSubgroup: boolean;

  withBatchReview: boolean;
  batchListColumns: string[];

  constructor(config?: Omit<Partial<WidgetBatchArchiveConfig>, 'version'>) {
    this.version = WidgetBatchArchiveConfigVersion;

    if (config) {
      Object.assign(this, config);
    }
  }
}
