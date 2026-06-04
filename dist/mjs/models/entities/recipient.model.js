import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Diverse"] = "Diverse";
})(Gender || (Gender = {}));
export class Recipient extends ConfigurationEntity {
    constructor() {
        super();
        this.Salutation = new Field();
        this.Gender = new Field();
        this.Principal = new Field(null);
        this.Contacts = new Field({});
        this.Enabled = new Field(false);
        this.FirstName = new Field(null);
        this.LastName = new Field(null);
    }
}
export class RecipientContact {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class EmailContact extends RecipientContact {
    constructor() {
        super('EmailContact');
    }
}
export class PhoneBasedContact extends RecipientContact {
    constructor(typeName) {
        super(typeName);
    }
}
export class SmsContact extends PhoneBasedContact {
    constructor() {
        super('SmsContact');
    }
}
export class VoipContact extends PhoneBasedContact {
    constructor() {
        super('VoipContact');
    }
}
export class TelegramContact extends RecipientContact {
    constructor() {
        super('TelegramContact');
    }
}
export class TeamsContact extends RecipientContact {
    constructor() {
        super('TeamsContact');
    }
}
export class PushoverContact extends RecipientContact {
    constructor() {
        super('PushoverContact');
    }
}
