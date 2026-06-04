import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Diverse = 'Diverse',
}

export class Recipient extends ConfigurationEntity {
  public Salutation: Field<string>;
  public Gender: Field<Gender>;
  public FirstName: Field<string>;
  public LastName: Field<string>;
  public Principal: Field<string>;
  public Contacts: Field<{ [key: string]: RecipientContact }>;
  public Enabled: Field<boolean>;

  constructor() {
    super();
    this.Salutation = new Field<string>();
    this.Gender = new Field<Gender>();
    this.Principal = new Field<string>(null);
    this.Contacts = new Field<{ [key: string]: RecipientContact }>({});
    this.Enabled = new Field<boolean>(false);
    this.FirstName = new Field<string>(null);
    this.LastName = new Field<string>(null);
  }
}

export abstract class RecipientContact {
  public _t: string;
  public Enabled: boolean;
  public MessageLine: string;
  public MessageTemplate: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class EmailContact extends RecipientContact {
  public Address: string;

  constructor() {
    super('EmailContact');
  }
}

export abstract class PhoneBasedContact extends RecipientContact {
  public Number: string;

  constructor(typeName?: string) {
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
  public UserId: string;

  constructor() {
    super('TelegramContact');
  }
}

export class TeamsContact extends RecipientContact {
  public AADId: string;

  constructor() {
    super('TeamsContact');
  }
}

export class PushoverContact extends RecipientContact {
  public UserKey: string;

  constructor() {
    super('PushoverContact');
  }
}
