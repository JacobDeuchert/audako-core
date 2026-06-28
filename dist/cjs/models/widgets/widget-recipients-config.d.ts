import { BaseWidgetConfig } from './shared.js';
export declare enum RecipientType {
    EmailContact = "EmailContact",
    PushoverContact = "PushoverContact",
    SmsContact = "SmsContact",
    VoipContact = "VoipContact",
    TeamsContact = "TeamsContact",
    TelegramContact = "TelegramContact"
}
export declare const WidgetRecipientsConfigVersion = "5";
export declare class WidgetRecipientsConfig extends BaseWidgetConfig {
    groupId: string;
    showContacts: boolean;
    showContactsMatrix: Partial<Record<RecipientType, string[]>>;
    allowEditing: boolean;
    editableRecipientIds: string[];
    constructor();
}
