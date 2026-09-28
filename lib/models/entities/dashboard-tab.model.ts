import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class DashboardTab extends ConfigurationEntity {
  public DashboardId: Field<string>;
  public Content: Field<string>;
  public MasterTabId: Field<string>;
  public EntityMappings: Field<{ [key: string]: DashboardTabEntity }>;
  public PlaceholderDefinition: Field<DashboardTabPlaceholder[]>;
  public PlaceholderValues: Field<{ [key: string]: string }>;
  /**
   * Position within the dashboard, ascending. v5 only (feature `dashboardTabOrder`): v4 keeps the
   * order as an id list on the dashboard. Undefined on v4.
   */
  public Order?: Field<number>;

  constructor() {
    super();
    this.DashboardId = new Field<string>();
    this.Content = new Field<string>();
    this.MasterTabId = new Field<string>();
    this.EntityMappings = new Field<{ [key: string]: DashboardTabEntity }>();
    this.PlaceholderDefinition = new Field<DashboardTabPlaceholder[]>();
    this.PlaceholderValues = new Field<{ [key: string]: string }>();
  }
}

export class DashboardTabPlaceholder {
  public Name: string;
  public PropertyId: string;
  public DefaultValue: string;
}

export class DashboardTabEntity {
  public EntityId: string;
  public Type: string;
}
