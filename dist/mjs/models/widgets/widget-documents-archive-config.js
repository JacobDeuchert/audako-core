import { BaseWidgetConfig } from './shared.js';
export const WidgetDocumentsArchiveConfigVersion = '1';
export class WidgetDocumentsArchiveConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetDocumentsArchiveConfigVersion;
    }
}
