import { BaseWidgetConfig } from './shared.js';
export const WidgetSwitchOperationListConfigVersion = '1';
export class WidgetSwitchOperationListConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetSwitchOperationListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
