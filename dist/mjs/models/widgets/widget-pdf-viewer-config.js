import { BaseWidgetConfig } from './shared.js';
export const WidgetPdfViewerConfigVersion = '1';
export class WidgetPdfViewerConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetPdfViewerConfigVersion;
    }
}
