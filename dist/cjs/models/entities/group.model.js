"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateVariable = exports.PropertyGroup = exports.PartList = exports.Group = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Group extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Type = 'Default';
        this.IsEntryPoint = false;
        this.PartGroups = [];
        this.PropertyGroups = [];
        this.OOVariables = {};
        this.TemplateVariables = [];
    }
}
exports.Group = Group;
class PartList {
}
exports.PartList = PartList;
class PropertyGroup {
}
exports.PropertyGroup = PropertyGroup;
class TemplateVariable {
}
exports.TemplateVariable = TemplateVariable;
