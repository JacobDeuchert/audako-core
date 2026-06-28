import { BaseWidgetConfig } from './shared.js';

export const WidgetNotesConfigVersion = '1';

export class WidgetNotesConfig extends BaseWidgetConfig {
  storageId: string;

  constructor() {
    super();
    this.version = WidgetNotesConfigVersion;
  }
}
