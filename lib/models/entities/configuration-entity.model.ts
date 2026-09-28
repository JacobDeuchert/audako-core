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
  /** `null` means "no value"; the platform serializes every field, absent values arrive as null. */
  public Value: T | null;
  public OOAttributes: FieldObjectOrientationAttribute[];

  constructor(value: T | null = null, ooAttributes: FieldObjectOrientationAttribute[] = []) {
    this.Value = value;
    this.OOAttributes = ooAttributes;
  }

  public static isField(value: any): value is Field<any> {
    return value && value.Value !== undefined;
  }
}

export class TranslatableField<T> extends Field<T> {
  public Translations: { [language: string]: T };

  constructor(value: T | null = null, ooAttributes: FieldObjectOrientationAttribute[] = []) {
    super(value, ooAttributes);
    this.Translations = {};
  }
}

export abstract class ConfigurationEntity {
  public Id: string | null;

  public Path: string[];

  public Name: TranslatableField<string>;
  public Alias: Field<string>;
  public Description: TranslatableField<string>;

  public Tags: Field<string[]>;

  public Version: number;

  public AdditionalFields: { [p: string]: Field<string> };

  public GroupId: string | null;

  public CreatedBy: string | null;
  public CreatedOn: Date | null;

  public ChangedBy?: string | null;
  public ChangedOn?: Date | null;

  public MaintenanceMode: boolean;

  public IsInstanceOf?: string | null;
  public IsTemplate: boolean;

  public OOAttributes: EntityObjectOrientationAttribute[];

  /**
   * Server-owned: id of the maintenance manager configuration that created and owns the entity.
   * Never sent on writes. v5 only (feature `managedBy`); v4 only stores an unresolvable
   * `CreatedWithManager` flag in `AdditionalFields`, so this stays `null` there.
   */
  public ManagedBy?: string | null;
  /**
   * Server-owned: id of the synchronization partner the entity came from, `"unknown"` for
   * entities that only carry the old `Synchronized` flag. Never sent on writes.
   */
  public SynchronizedFrom?: string | null;

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

    // Audit fields are server-owned: never default them, or a missing value would look like real data.
    this.CreatedBy = null;
    this.CreatedOn = null;

    this.ChangedBy = null;
    this.ChangedOn = null;

    this.MaintenanceMode = false;

    this.IsInstanceOf = null;
    this.IsTemplate = false;

    this.OOAttributes = [];

    this.ManagedBy = null;
    this.SynchronizedFrom = null;


    Object.assign(this, options);

  }
}
