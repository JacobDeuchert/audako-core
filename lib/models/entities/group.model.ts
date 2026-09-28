import { ConfigurationEntity, Field } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';

export class Group extends ConfigurationEntity {
  public Type: string;
  public IsEntryPoint: boolean;

  public PartGroups: Field<PartList>[];
  public PropertyGroups: Field<PropertyGroup>[];

  public OOVariables: { [name: string]: string };

  public TemplateVariables: TemplateVariable[];

  /** At most 64 characters. */
  public Icon: Field<string>;
  public Order: Field<number | null>;
  public Position: Field<GeoPosition>;
  /** `File(<id>)` */
  public Picture: Field<string>;
  public StartDashboardId?: Field<string>;

  constructor() {
    super();
    this.Type = 'Default';
    this.IsEntryPoint = false;
    this.PartGroups = [];
    this.PropertyGroups = [];
    this.OOVariables = {};
    this.TemplateVariables = [];
    this.Icon = new Field<string>();
    this.Order = new Field<number | null>();
    this.Position = new Field<GeoPosition>();
    this.Picture = new Field<string>();
  }
}

export class GeoPosition {
  /** -90..90 */
  public Latitude: number;
  /** -180..180 */
  public Longitude: number;
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
