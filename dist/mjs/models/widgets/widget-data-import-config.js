import { BaseWidgetConfig } from './shared.js';
export const WidgetDataImportConfigVersion = '1';
export class WidgetDataImportConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.title = 'WidgetDataImport';
        this.signals = [];
        this.version = WidgetDataImportConfigVersion;
        this.signals = [];
        if (options) {
            Object.assign(this, options);
        }
    }
}
