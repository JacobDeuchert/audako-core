import { BaseWidgetConfig } from './shared.js';

export const WidgetSingleSignalConfigVersion = '1';

export class WidgetSingleSignalConfig extends BaseWidgetConfig {
  signalId: string;
  selectedIcon: string;
  manageConditions: boolean;
  includeSignalHist: boolean;

  constructor() {
    super();
    this.version = WidgetSingleSignalConfigVersion;
    this.signalId = '';
    this.selectedIcon = '';
  }
}
