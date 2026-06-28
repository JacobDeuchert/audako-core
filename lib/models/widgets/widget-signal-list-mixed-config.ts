import { BaseWidgetConfig } from './shared.js';

export const WidgetSignalListMixedConfigVersion = '5';

export type SortDirection = 'asc' | 'desc' | '';

export class SignalListGroup {
  signalIds: string[];
  id: string;
  name: string;
  expanded: boolean = true;
  defaultSort: string;
  defaultSortOrder: SortDirection;
}

export class WidgetSignalListMixedConfig extends BaseWidgetConfig {
  headerElements: string[];
  groups: SignalListGroup[];
  intervalThresholds: { signalId: string; threshold: number; deactivatedIntervall: boolean }[];

  constructor() {
    super();
    this.version = WidgetSignalListMixedConfigVersion;
  }
}
