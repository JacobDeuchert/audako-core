import { BaseWidgetConfig } from './shared.js';
export var RecipientType;
(function (RecipientType) {
    RecipientType["EmailContact"] = "EmailContact";
    RecipientType["PushoverContact"] = "PushoverContact";
    RecipientType["SmsContact"] = "SmsContact";
    RecipientType["VoipContact"] = "VoipContact";
    RecipientType["TeamsContact"] = "TeamsContact";
    RecipientType["TelegramContact"] = "TelegramContact";
})(RecipientType || (RecipientType = {}));
export const WidgetRecipientsConfigVersion = '5';
export class WidgetRecipientsConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetRecipientsConfigVersion;
        this.showContacts = false;
        this.showContactsMatrix = {};
        this.allowEditing = false;
        this.editableRecipientIds = [];
    }
}
