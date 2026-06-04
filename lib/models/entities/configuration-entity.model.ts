import { Type } from '../../interfaces/type.js';

export enum EntityType {
  Group = 'Group',
  Signal = 'Signal',
  Formula = 'Formula',
  Dashboard = 'Dashboard',
  DashboardTab = 'DashboardTab',
  DataConnection = 'DataConnection',
  DataSource = 'DataSource',
  Connector = 'Connector',
  EventCondition = 'EventCondition',
  EventDefinition = 'EventDefinition',
  EventCategory = 'EventCategory',
  ProcessImage = 'ProcessImage',
  BatchDefinition = 'BatchDefinition',
  ReportTemplate = 'ReportTemplate',
  Report = 'Report',
  Document = 'Document',
  Storage = 'Storage',
  Camera = 'Camera',
  SwitchSchedule = 'SwitchSchedule',
  User = 'User',
  Role = 'Role',
  Recipient = 'Recipient',
  RecipientGroup = 'RecipientGroup',
  AlarmingPlan = 'AlarmingPlan',
  MaintenanceService = 'MaintenanceService',
  TaskDefinition = 'TaskDefinition',
  RuntimeScript = 'RuntimeScript',
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
  Connector: '/daq/Connector',
  EventCondition: '/base/condition',
  ProcessImage: '/scada/ProcessImage',
  EventCategory: '/base/EventCategory',
  EventDefinition: '/base/EventDefinition',
  BatchDefinition: '/scada/batchdefinition',
  ReportTemplate: '/scada/ReportTemplate',
  Report: '/scada/Report',
  Document: '/base/Document',
  Storage: '/base/Storage',
  Camera: '/scada/Camera',
  SwitchSchedule: '/scada/SwitchSchedule',
  User: '/base/User',
  Role: '/base/Role',
  Recipient: '/alarming/Recipient',
  RecipientGroup: '/alarming/RecipientGroup',
  AlarmingPlan: '/alarming/AlarmingPlan',
  MaintenanceService: '/maintenance/MaintenanceService',
  TaskDefinition: '/maintenance/TaskDefinition',
  RuntimeScript: '/runtime/RuntimeScript',
};

export enum FieldObjectOrientationAttribute {
  Locked = 'Locked',
  Overwritten = 'Overwritten',
  FillInVariables = 'FillInVariables',
  ResolveRelative = 'ResolveRelative',
}

export enum EntityObjectOrientationAttribute {
  Locked = 'Locked',
  Overwritten = 'Overwritten',
}

export class Field<T> {
  public Value: T;
  public OOAttributes: FieldObjectOrientationAttribute[];


  constructor(value: T = null, ooAttributes: FieldObjectOrientationAttribute[] = []) {
    this.Value = value;
    this.OOAttributes = ooAttributes;
  }

  public static isField(value: any): value is Field<any> {
    return value && value.Value !== undefined;
  }
}

export class TranslatableField<T> extends Field<T> {
  public Translations: { [language: string]: T };

  constructor(value: T = null, ooAttributes: FieldObjectOrientationAttribute[] = []) {
    super(value, ooAttributes);
    this.Translations = {};
  }
}

export abstract class ConfigurationEntity {
  public Id: string;

  public Path: string[];

  public Name: TranslatableField<string>;
  public Alias: Field<string>;
  public Description: TranslatableField<string>;

  public Tags: Field<string[]>;

  public Version: number;

  public AdditionalFields: { [p: string]: Field<string> };

  public GroupId: string;

  public CreatedBy: string;
  public CreatedOn: Date;

  public ChangedBy?: string;
  public ChangedOn?: Date;

  public MaintenanceMode: boolean;

  public IsInstanceOf?: string;
  public IsTemplate: boolean;

  public OOAttributes: EntityObjectOrientationAttribute[];

  constructor(options?: Partial<ConfigurationEntity>) {
    this.Name = new TranslatableField<string>();
    this.Alias = new Field<string>();
    this.Description = new TranslatableField<string>();
    this.Tags = new Field<string[]>([]);
    this.Version = 0;
    this.AdditionalFields = {};

    this.Id = null;
    this.Path = [];
    this.GroupId = null;

    this.CreatedBy = null;
    this.CreatedOn = new Date();

    this.ChangedBy = null;
    this.ChangedOn = null;

    this.MaintenanceMode = false;

    this.IsInstanceOf = null;
    this.IsTemplate = false;

    this.OOAttributes = [];


    Object.assign(this, options);

  }
}
