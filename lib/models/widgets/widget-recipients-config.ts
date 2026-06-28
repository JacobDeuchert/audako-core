import { BaseWidgetConfig } from './shared.js';

export enum RecipientType {
  EmailContact = 'EmailContact',
  PushoverContact = 'PushoverContact',
  SmsContact = 'SmsContact',
  VoipContact = 'VoipContact',
  TeamsContact = 'TeamsContact',
  TelegramContact = 'TelegramContact',
}

export const WidgetRecipientsConfigVersion = '5';

export class WidgetRecipientsConfig extends BaseWidgetConfig {
  groupId: string;
  showContacts: boolean;
  showContactsMatrix: Partial<Record<RecipientType, string[]>>;
  allowEditing: boolean;
  editableRecipientIds: string[];

  constructor() {
    super();
    this.version = WidgetRecipientsConfigVersion;
    this.showContacts = false;
    this.showContactsMatrix = {};
    this.allowEditing = false;
    this.editableRecipientIds = [];
  }
}
