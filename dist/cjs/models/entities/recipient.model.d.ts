import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum Gender {
    Male = "Male",
    Female = "Female",
    Diverse = "Diverse"
}
export declare class Recipient extends ConfigurationEntity {
    Salutation: Field<string>;
    Gender: Field<Gender>;
    FirstName: Field<string>;
    LastName: Field<string>;
    Principal: Field<string>;
    Contacts: Field<{
        [key: string]: RecipientContact;
    }>;
    Enabled: Field<boolean>;
    constructor();
}
export declare abstract class RecipientContact {
    _t: string;
    Enabled: boolean;
    MessageLine: string;
    MessageTemplate: string;
    constructor(typeName?: string);
}
export declare class EmailContact extends RecipientContact {
    Address: string;
    constructor();
}
export declare abstract class PhoneBasedContact extends RecipientContact {
    Number: string;
    constructor(typeName?: string);
}
export declare class SmsContact extends PhoneBasedContact {
    constructor();
}
export declare class VoipContact extends PhoneBasedContact {
    constructor();
}
export declare class TelegramContact extends RecipientContact {
    UserId: string;
    constructor();
}
export declare class TeamsContact extends RecipientContact {
    AADId: string;
    constructor();
}
export declare class PushoverContact extends RecipientContact {
    UserKey: string;
    constructor();
}
