import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum ConnectorType {
  RestApi = 'RestApi',
}

export class Connector extends ConfigurationEntity {
  public Type: Field<ConnectorType>;
  public Settings: ConnectorTypedSettings;
  public Objects: ConnectorObject[];

  constructor() {
    super();
    this.Type = new Field<ConnectorType>();
    this.Objects = [];
  }
}

export abstract class ConnectorTypedSettings {
  public _t: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class ConnectorRestApiSettings extends ConnectorTypedSettings {
  public Credentials: ConnectorRestApiCredential[];

  constructor() {
    super('ConnectorRestApiSettings');
    this.Credentials = [];
  }
}

export class ConnectorRestApiCredential {
  public ClientId: Field<string>;
  public ClientSecret: Field<string>;

  constructor() {
    this.ClientId = new Field<string>();
    this.ClientSecret = new Field<string>();
  }
}

export enum ConnectorObjectType {
  Signal = 'Signal',
  Formula = 'Formula',
  Group = 'Group',
  EventCategory = 'EventCategory',
  BatchDefinition = 'BatchDefinition',
}

export enum ConnectorObjectAccessLevel {
  Read = 'Read',
  ReadWrite = 'ReadWrite',
  Write = 'Write',
}

export class ConnectorObject {
  public ObjectName: Field<string>;
  public ObjectType: Field<ConnectorObjectType>;
  public ObjectId: Field<string>;
  public AccessLevel: Field<ConnectorObjectAccessLevel>;

  constructor() {
    this.ObjectName = new Field<string>();
    this.ObjectType = new Field<ConnectorObjectType>();
    this.ObjectId = new Field<string>();
    this.AccessLevel = new Field<ConnectorObjectAccessLevel>();
  }
}
