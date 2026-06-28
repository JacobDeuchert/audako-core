import { BaseWidgetConfig } from './shared.js';

export const WidgetRecipientGroupConfigVersion = '1';

export class WidgetRecipientGroupConfig extends BaseWidgetConfig {
  recipientGroupId: string;

  constructor() {
    super();
    this.title = 'Widget';
    this.version = WidgetRecipientGroupConfigVersion;
    this.recipientGroupId = '';
  }
}
