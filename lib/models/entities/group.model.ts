import { ConfigurationEntity, Field } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';

export class Group extends ConfigurationEntity {
  public Type: string;
  public IsEntryPoint: boolean;

  public PartGroups: Field<PartList>[];
  public PropertyGroups: Field<PropertyGroup>[];

  public OOVariables: { [name: string]: string };

  public TemplateVariables: TemplateVariable[];

  /** Icon name, at most 64 characters. */
  public Icon: Field<string>;
  /** Sort key, ascending; `null` sorts last (then by `Name`). */
  public Order: Field<number | null>;
  public Position: Field<GeoPosition>;
  /** `File(<id>)`. Upload and delete go through the picture endpoints, not a `PUT`. */
  public Picture: Field<string>;
  /**
   * Start dashboard of an entry point. v5 only (feature `entryPointStartDashboard`): v4 flags the
   * dashboards instead, which a per-entity adapter cannot resolve. Undefined on v4.
   */
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
