import { BaseWidgetConfig } from './shared.js';

export const WidgetResettableCounterConfigVersion = '1';

export class WidgetResettableCounterConfig extends BaseWidgetConfig {
  SignalId: string;

  Icon: string;

  manageConditions: boolean;
  includeSignalHist: boolean;

  constructor() {
    super();

    this.version = WidgetResettableCounterConfigVersion;
  }
}
