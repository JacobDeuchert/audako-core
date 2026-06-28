import { BaseWidgetConfig } from './shared.js';
export const WidgetLiveModeConfigVersion = '2';
export class WidgetLiveModeConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.title = '';
        this.queryType = null;
        this.version = WidgetLiveModeConfigVersion;
    }
}
