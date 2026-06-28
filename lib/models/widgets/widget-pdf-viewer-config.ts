import { BaseWidgetConfig } from './shared.js';

export const WidgetPdfViewerConfigVersion = '1';

export class WidgetPdfViewerConfig extends BaseWidgetConfig {
  documentId: string;

  constructor() {
    super();
    this.version = WidgetPdfViewerConfigVersion;
  }
}
