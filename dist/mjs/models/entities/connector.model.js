import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var ConnectorType;
(function (ConnectorType) {
    ConnectorType["RestApi"] = "RestApi";
})(ConnectorType || (ConnectorType = {}));
export class Connector extends ConfigurationEntity {
    constructor() {
        super();
        this.Type = new Field();
        this.Objects = [];
    }
}
export class ConnectorTypedSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class ConnectorRestApiSettings extends ConnectorTypedSettings {
    constructor() {
        super('ConnectorRestApiSettings');
        this.Credentials = [];
    }
}
export class ConnectorRestApiCredential {
    constructor() {
        this.ClientId = new Field();
        this.ClientSecret = new Field();
    }
}
export var ConnectorObjectType;
(function (ConnectorObjectType) {
    ConnectorObjectType["Signal"] = "Signal";
    ConnectorObjectType["Formula"] = "Formula";
    ConnectorObjectType["Group"] = "Group";
    ConnectorObjectType["EventCategory"] = "EventCategory";
    ConnectorObjectType["BatchDefinition"] = "BatchDefinition";
})(ConnectorObjectType || (ConnectorObjectType = {}));
export var ConnectorObjectAccessLevel;
(function (ConnectorObjectAccessLevel) {
    ConnectorObjectAccessLevel["Read"] = "Read";
    ConnectorObjectAccessLevel["ReadWrite"] = "ReadWrite";
    ConnectorObjectAccessLevel["Write"] = "Write";
})(ConnectorObjectAccessLevel || (ConnectorObjectAccessLevel = {}));
export class ConnectorObject {
    constructor() {
        this.ObjectName = new Field();
        this.ObjectType = new Field();
        this.ObjectId = new Field();
        this.AccessLevel = new Field();
    }
}
