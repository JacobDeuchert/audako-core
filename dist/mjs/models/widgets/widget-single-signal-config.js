import { BaseWidgetConfig } from './shared.js';
export const WidgetSingleSignalConfigVersion = '1';
export class WidgetSingleSignalConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetSingleSignalConfigVersion;
        this.signalId = '';
        this.selectedIcon = '';
    }
}
