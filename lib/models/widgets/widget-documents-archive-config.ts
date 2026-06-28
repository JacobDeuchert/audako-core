import { BaseWidgetConfig } from './shared.js';

export const WidgetDocumentsArchiveConfigVersion = '1';

export class WidgetDocumentsArchiveConfig extends BaseWidgetConfig {
  groupId: string;

  constructor() {
    super();
    this.version = WidgetDocumentsArchiveConfigVersion;
  }
}
