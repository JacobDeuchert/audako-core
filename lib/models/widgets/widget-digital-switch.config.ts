import { BaseWidgetConfig } from './shared.js';

export const WidgetDigitalSwitchConfigVersion = '2';

export class WidgetDigitalSwitchConfig extends BaseWidgetConfig {
  signalId: string;
  signalLockId: string;
  lockingValue: any;
  customLockingValue: any;
  lockingState: number | null;
  displayStatus: boolean;
  caption: string | null;
  type: string | null;
  manageConditions: boolean;
  includeSignalHist: boolean;

  constructor() {
    super();
    this.version = WidgetDigitalSwitchConfigVersion;
    this.type = null;
    this.caption = null;
    this.lockingValue = null;
    this.customLockingValue = null;
    this.lockingState = null;
    this.displayStatus = false;
    this.manageConditions = false;
    this.includeSignalHist = false;
  }
}
