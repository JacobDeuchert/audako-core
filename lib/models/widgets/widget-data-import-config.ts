import { BaseWidgetConfig } from './shared.js';

export const WidgetDataImportConfigVersion = '1';

export class WidgetDataImportConfig extends BaseWidgetConfig {
  title: string = 'WidgetDataImport';
  signals: string[] = [];
  version: string;

  constructor(options?: Partial<WidgetDataImportConfig>) {
    super();

    this.version = WidgetDataImportConfigVersion;
    this.signals = [];

    if (options) {
      Object.assign(this, options);
    }
  }
}
