import { BaseWidgetConfig } from './shared.js';
export const WidgetSignalListMixedConfigVersion = '5';
export class SignalListGroup {
    constructor() {
        this.expanded = true;
    }
}
export class WidgetSignalListMixedConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetSignalListMixedConfigVersion;
    }
}
