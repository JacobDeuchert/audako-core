import { BaseWidgetConfig } from './shared.js';
export const WidgetResettableCounterConfigVersion = '1';
export class WidgetResettableCounterConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetResettableCounterConfigVersion;
    }
}
