import { BaseWidgetConfig } from './shared.js';
export const WidgetCounterManagementConfigVersion = '1';
export class WidgetCounterManagementConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetCounterManagementConfigVersion;
        this.counterSignalIds = [];
    }
}
