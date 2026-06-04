"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorObject = exports.ConnectorObjectAccessLevel = exports.ConnectorObjectType = exports.ConnectorRestApiCredential = exports.ConnectorRestApiSettings = exports.ConnectorTypedSettings = exports.Connector = exports.ConnectorType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var ConnectorType;
(function (ConnectorType) {
    ConnectorType["RestApi"] = "RestApi";
})(ConnectorType || (exports.ConnectorType = ConnectorType = {}));
class Connector extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Type = new configuration_entity_model_js_1.Field();
        this.Objects = [];
    }
}
exports.Connector = Connector;
class ConnectorTypedSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.ConnectorTypedSettings = ConnectorTypedSettings;
class ConnectorRestApiSettings extends ConnectorTypedSettings {
    constructor() {
        super('ConnectorRestApiSettings');
        this.Credentials = [];
    }
}
exports.ConnectorRestApiSettings = ConnectorRestApiSettings;
class ConnectorRestApiCredential {
    constructor() {
        this.ClientId = new configuration_entity_model_js_1.Field();
        this.ClientSecret = new configuration_entity_model_js_1.Field();
    }
}
exports.ConnectorRestApiCredential = ConnectorRestApiCredential;
var ConnectorObjectType;
(function (ConnectorObjectType) {
    ConnectorObjectType["Signal"] = "Signal";
    ConnectorObjectType["Formula"] = "Formula";
    ConnectorObjectType["Group"] = "Group";
    ConnectorObjectType["EventCategory"] = "EventCategory";
    ConnectorObjectType["BatchDefinition"] = "BatchDefinition";
})(ConnectorObjectType || (exports.ConnectorObjectType = ConnectorObjectType = {}));
var ConnectorObjectAccessLevel;
(function (ConnectorObjectAccessLevel) {
    ConnectorObjectAccessLevel["Read"] = "Read";
    ConnectorObjectAccessLevel["ReadWrite"] = "ReadWrite";
    ConnectorObjectAccessLevel["Write"] = "Write";
})(ConnectorObjectAccessLevel || (exports.ConnectorObjectAccessLevel = ConnectorObjectAccessLevel = {}));
class ConnectorObject {
    constructor() {
        this.ObjectName = new configuration_entity_model_js_1.Field();
        this.ObjectType = new configuration_entity_model_js_1.Field();
        this.ObjectId = new configuration_entity_model_js_1.Field();
        this.AccessLevel = new configuration_entity_model_js_1.Field();
    }
}
exports.ConnectorObject = ConnectorObject;
