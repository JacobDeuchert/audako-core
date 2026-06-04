import { ConfigurationEntity, Field } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';

export class Group extends ConfigurationEntity {
  public Type: string;
  public IsEntryPoint: boolean;

  public PartGroups: Field<PartList>[];
  public PropertyGroups: Field<PropertyGroup>[];

  public OOVariables: { [name: string]: string };

  public TemplateVariables: TemplateVariable[];

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
  public Name: string;
  public Parts: string[];
}

export class PropertyGroup {
  public Name: string;
  public Properties: { [key: string]: any };
}

export class TemplateVariable {
  public Name: string;
  public FieldSettings: CustomFieldSettings;
}
