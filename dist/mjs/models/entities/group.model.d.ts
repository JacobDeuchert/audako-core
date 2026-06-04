import { ConfigurationEntity, Field } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';
export declare class Group extends ConfigurationEntity {
    Type: string;
    IsEntryPoint: boolean;
    PartGroups: Field<PartList>[];
    PropertyGroups: Field<PropertyGroup>[];
    OOVariables: {
        [name: string]: string;
    };
    TemplateVariables: TemplateVariable[];
    constructor();
}
export declare class PartList {
    Name: string;
    Parts: string[];
}
export declare class PropertyGroup {
    Name: string;
    Properties: {
        [key: string]: any;
    };
}
export declare class TemplateVariable {
    Name: string;
    FieldSettings: CustomFieldSettings;
}
