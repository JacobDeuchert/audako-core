import { BaseWidgetConfig } from './shared.js';
export const WidgetDigitalSwitchConfigVersion = '2';
export class WidgetDigitalSwitchConfig extends BaseWidgetConfig {
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
