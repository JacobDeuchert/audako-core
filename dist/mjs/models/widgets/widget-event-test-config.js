import { BaseWidgetConfig } from './shared.js';
export const WidgetEventTestConfigVersion = '1';
export class WidgetEventTestConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.Events = [];
        this.version = WidgetEventTestConfigVersion;
    }
}
