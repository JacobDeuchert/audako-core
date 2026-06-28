"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetRecipientsConfig = exports.WidgetRecipientsConfigVersion = exports.RecipientType = void 0;
const shared_js_1 = require("./shared.js");
var RecipientType;
(function (RecipientType) {
    RecipientType["EmailContact"] = "EmailContact";
    RecipientType["PushoverContact"] = "PushoverContact";
    RecipientType["SmsContact"] = "SmsContact";
    RecipientType["VoipContact"] = "VoipContact";
    RecipientType["TeamsContact"] = "TeamsContact";
    RecipientType["TelegramContact"] = "TelegramContact";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
exports.WidgetRecipientsConfigVersion = '5';
class WidgetRecipientsConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetRecipientsConfigVersion;
        this.showContacts = false;
        this.showContactsMatrix = {};
        this.allowEditing = false;
        this.editableRecipientIds = [];
    }
}
exports.WidgetRecipientsConfig = WidgetRecipientsConfig;
