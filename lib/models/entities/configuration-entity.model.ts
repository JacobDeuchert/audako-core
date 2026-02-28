import { Type } from '../../interfaces/type.js';

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
  ProcessImage = 'ProcessImage',
  BatchDefinition = 'BatchDefinition',
}

export const EntityIcons: { [p in EntityType]?: string } = {
  [EntityType.Group]: 'mat folder',
  [EntityType.Dashboard]: 'adk adk-dashboard',
  [EntityType.Signal]: 'mat code',
  [EntityType.Formula]: 'mat timeline',
  [EntityType.DataConnection]: 'mat data_usage',
  [EntityType.DataSource]: 'mat storage',
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
  BatchDefinition: '/scada/batchdefinition'
};

export class Field<T> {
  public Value: T;
  public OOAttributes: string[];


  constructor(value: T = null, ooAttributes: string[] = []) {
    this.Value = value;
    this.OOAttributes = ooAttributes;
  }

  public static isField(value: any): value is Field<any> {
    return value && value.Value !== undefined;
  }
}

export abstract class ConfigurationEntity {
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

  public IsInstanceOf?: string;
  public IsTemplate: boolean;

  constructor(options?: Partial<ConfigurationEntity>) {
    this.Name = new Field<string>();
    this.Description = new Field<string>();
    this.AdditionalFields = {};

    this.Id = null;
    this.Path = [];
    this.GroupId = null;

    this.CreatedBy = null;
    this.CreatedOn = new Date();
    
    this.ChangedBy = null;
    this.ChangedOn = null;


    this.IsInstanceOf = null;
    this.IsTemplate = false;
    

    Object.assign(this, options);

  }
}
