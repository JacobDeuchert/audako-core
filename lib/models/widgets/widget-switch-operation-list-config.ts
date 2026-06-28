import { BaseWidgetConfig } from './shared.js';

export const WidgetSwitchOperationListConfigVersion = '1';

export class WidgetSwitchOperationListConfig extends BaseWidgetConfig {
  selectedSwitchSchedule: string;

  constructor(options?: Partial<WidgetSwitchOperationListConfig>) {
    super();
    this.version = WidgetSwitchOperationListConfigVersion;

    if (options) {
      Object.assign(this, options);
    }
  }
}
