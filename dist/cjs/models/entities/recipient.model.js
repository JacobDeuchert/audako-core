"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushoverContact = exports.TeamsContact = exports.TelegramContact = exports.VoipContact = exports.SmsContact = exports.PhoneBasedContact = exports.EmailContact = exports.RecipientContact = exports.Recipient = exports.Gender = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Diverse"] = "Diverse";
})(Gender || (exports.Gender = Gender = {}));
class Recipient extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Salutation = new configuration_entity_model_js_1.Field();
        this.Gender = new configuration_entity_model_js_1.Field();
        this.Principal = new configuration_entity_model_js_1.Field(null);
        this.Contacts = new configuration_entity_model_js_1.Field({});
        this.Enabled = new configuration_entity_model_js_1.Field(false);
        this.FirstName = new configuration_entity_model_js_1.Field(null);
        this.LastName = new configuration_entity_model_js_1.Field(null);
    }
}
exports.Recipient = Recipient;
class RecipientContact {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.RecipientContact = RecipientContact;
class EmailContact extends RecipientContact {
    constructor() {
        super('EmailContact');
    }
}
exports.EmailContact = EmailContact;
class PhoneBasedContact extends RecipientContact {
    constructor(typeName) {
        super(typeName);
    }
}
exports.PhoneBasedContact = PhoneBasedContact;
class SmsContact extends PhoneBasedContact {
    constructor() {
        super('SmsContact');
    }
}
exports.SmsContact = SmsContact;
class VoipContact extends PhoneBasedContact {
    constructor() {
        super('VoipContact');
    }
}
exports.VoipContact = VoipContact;
class TelegramContact extends RecipientContact {
    constructor() {
        super('TelegramContact');
    }
}
exports.TelegramContact = TelegramContact;
class TeamsContact extends RecipientContact {
    constructor() {
        super('TeamsContact');
    }
}
exports.TeamsContact = TeamsContact;
class PushoverContact extends RecipientContact {
    constructor() {
        super('PushoverContact');
    }
}
exports.PushoverContact = PushoverContact;
