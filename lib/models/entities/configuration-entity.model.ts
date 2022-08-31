export enum EntityType {
  Group = 'Group',
  Signal = 'Signal',
  Formula = 'Formula',
  Dashboard = 'Dashboard',
  DashboardTab = 'DashboardTab',
  DataConnection = 'DataConnection',
  DataSource = 'DataSource',
  EventCondition = 'EventCondition',
  EventDefinition = 'EventDefinition',
  EventCategory = 'EventCategory',
  ProcessImage = 'ProcessImage'
}

export const EntityIcons: { [p in EntityType]?: string } = {
  [EntityType.Group]: 'fas fa-folder',
  [EntityType.Dashboard]: 'adk adk-dashboard',
  [EntityType.Signal]: 'fas fa-code',
  [EntityType.DataConnection]: 'fas fa-circle-notch',
  [EntityType.DataSource]: 'fas fa-server',
};

export const EntityHttpEndpoints: { [p in EntityType]: string } = {
  Group: '/base/Group',
  Signal: '/daq/Signal',
  Formula: '/daq/Formula',
  Dashboard: '/base/Dashboard',
  DashboardTab: '/base/DashboardTab',
  DataConnection: '/daq/DataConnection',
  DataSource: '/daq/DataSource',
  EventCondition: '/base/condition',
  ProcessImage: '/scada/ProcessImage',
  EventCategory: '/base/EventCategory',
  EventDefinition: '/base/EventDefinition',
};

export class Field<T> {
  public Value: T;
  public OOAttributes: string[];


  constructor(value: T = null, ooAttributes: string[] = []) {
    this.Value = value;
    this.OOAttributes = ooAttributes;
  }
}

export class ConfigurationEntity {
  public Id: string;

  public Path: string[];

  public Name: Field<string>;
  public Description: Field<string>;

  public AdditionalFields: { [p: string]: Field<string> };

  public GroupId: string;

  public CreatedBy: string;
  public CreatedOn: Date;

  public ChangedBy?: string;
  public ChangedOn?: Date;

  public IsInstanceOf?: boolean;
  public IsTemplate: boolean;

  constructor(options?: Partial<ConfigurationEntity>) {
    this.Name = new Field<string>();
    this.Description = new Field<string>();
    this.AdditionalFields = {};
    Object.assign(this, options);

  }
}
