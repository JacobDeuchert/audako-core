import { ConfigurationEntity } from './configuration-entity.model.js';
export class Group extends ConfigurationEntity {
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
export class PartList {
}
export class PropertyGroup {
}
export class TemplateVariable {
}
