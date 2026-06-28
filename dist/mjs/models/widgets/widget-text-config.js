import { BaseWidgetConfig } from './shared.js';
export const WidgetTextConfigVersion = '1';
export class WidgetTextConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = '1';
        this.headerExpanded = false;
    }
}
