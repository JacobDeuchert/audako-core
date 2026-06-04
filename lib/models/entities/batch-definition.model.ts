import { ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, TranslatableField } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';
import { EventAction, ReportStorageType } from './report.model.js';

export enum BatchAction {
  Start = 'Start',
  Stop = 'Stop',
  Release = 'Release',
}

export enum TriggerType {
  EventDefinition = 'EventDefinition',
  Condition = 'Condition',
  Manual = 'Manual',
}

export enum EventTriggerState {
  Raised = 'Raised',
  Dropped = 'Dropped',
}

export enum EventEntityType {
  EventDefinition = 'EventDefinition',
  Condition = 'Condition',
}

export enum MetadataFieldType {
  NumberField = 'NumberField',
  TextField = 'TextField',
  BooleanField = 'BooleanField',
  SelectField = 'SelectField',
  DateField = 'DateField',
  CustomMappingField = 'CustomMappingField',
  UserField = 'UserField',
  // backwards compatibility types
  TextAreaField = 'TextAreaField',
  CheckboxField = 'CheckboxField',
}

export enum MetadataSource {
  Manual = 'Manual',
  Signal = 'Signal',
  Incremental = 'Incremental',
}

export class BatchDefinition extends ConfigurationEntity {
  public ParallelBatchesEnabled: boolean;
  public BatchTriggers: TriggerDefinition[];
  public ReleaseSettings: BatchReleaseSettings;
  public MetadataFields: { [key: string]: MetadataField };
  public BatchValueObjects: BatchValueObject[];
  public ConditionEventEntries: ConditionEventEntry[];
  public BatchReportIds: string[];
  public BatchReportExportSettings: BatchReportExportSettings[];
  public BatchReviewSettings: BatchReviewSettings;

  constructor() {
    super();
    this.ParallelBatchesEnabled = false;
    this.BatchTriggers = [];
    this.MetadataFields = {};
    this.BatchValueObjects = [];
    this.ConditionEventEntries = [];
    this.BatchReportIds = [];
    this.BatchReportExportSettings = [];
    this.BatchReviewSettings = new BatchReviewSettings();
    this.ReleaseSettings = new BatchReleaseSettings();
  }
}

export class TriggerDefinition {
  public TriggerType: TriggerType;
  public ActionType: BatchAction;
  public EntityId: string;
  public TriggerOn: EventTriggerState | null;
}

export class BatchReleaseSettings {
  public Enabled: boolean = false;
  public SignalId: string = null;
  public ReleaseValue: any = null;
}

export class BatchValueObject {
  public Type: ValueObjectType;
  public EntityId: string;
}

export class ConditionEventEntry {
  public Type: EventEntityType;
  public EntityId: string;
}

export class MetadataField {
  public Name: string;
  public Type: MetadataFieldType;
  public Source: MetadataSource;
  public SignalId: string;
  public IncrementalCounterStart: number;
  public Optional: boolean;
  public Editable: boolean;
  public OrderSpecific: boolean;
  public WritebackSignalId: string;
  public WritebackResetValue: any;
  public ObligatoryAt: BatchAction;
  public Settings: CustomFieldSettings;
}

export class BatchReportExportSettings {
  public ReportId: string;
  public TemplateId: string;
  public Enabled: boolean;
  public FileNameTemplate: string;
  public Actions: EventAction[];
  public StorageType: ReportStorageType;
}

export class BatchReviewSettings {
  public Enabled: boolean = false;
  public Reviews: BatchReviewDefinition[] = [];
  public Ordered: boolean = false;
}

export class BatchReviewDefinition {
  public Name: TranslatableField<string>;
  public Instructions: TranslatableField<string>;
  public Reviewers: string[];
}
