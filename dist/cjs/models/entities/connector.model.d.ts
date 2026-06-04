import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum ConnectorType {
    RestApi = "RestApi"
}
export declare class Connector extends ConfigurationEntity {
    Type: Field<ConnectorType>;
    Settings: ConnectorTypedSettings;
    Objects: ConnectorObject[];
    constructor();
}
export declare abstract class ConnectorTypedSettings {
    _t: string;
    constructor(typeName?: string);
}
export declare class ConnectorRestApiSettings extends ConnectorTypedSettings {
    Credentials: ConnectorRestApiCredential[];
    constructor();
}
export declare class ConnectorRestApiCredential {
    ClientId: Field<string>;
    ClientSecret: Field<string>;
    constructor();
}
export declare enum ConnectorObjectType {
    Signal = "Signal",
    Formula = "Formula",
    Group = "Group",
    EventCategory = "EventCategory",
    BatchDefinition = "BatchDefinition"
}
export declare enum ConnectorObjectAccessLevel {
    Read = "Read",
    ReadWrite = "ReadWrite",
    Write = "Write"
}
export declare class ConnectorObject {
    ObjectName: Field<string>;
    ObjectType: Field<ConnectorObjectType>;
    ObjectId: Field<string>;
    AccessLevel: Field<ConnectorObjectAccessLevel>;
    constructor();
}
