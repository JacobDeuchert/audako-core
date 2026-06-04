import { ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, TranslatableField } from './configuration-entity.model.js';
import { CustomFieldSettings } from './custom-field-settings.model.js';
import { EventAction, ReportStorageType } from './report.model.js';
export declare enum BatchAction {
    Start = "Start",
    Stop = "Stop",
    Release = "Release"
}
export declare enum TriggerType {
    EventDefinition = "EventDefinition",
    Condition = "Condition",
    Manual = "Manual"
}
export declare enum EventTriggerState {
    Raised = "Raised",
    Dropped = "Dropped"
}
export declare enum EventEntityType {
    EventDefinition = "EventDefinition",
    Condition = "Condition"
}
export declare enum MetadataFieldType {
    NumberField = "NumberField",
    TextField = "TextField",
    BooleanField = "BooleanField",
    SelectField = "SelectField",
    DateField = "DateField",
    CustomMappingField = "CustomMappingField",
    UserField = "UserField",
    TextAreaField = "TextAreaField",
    CheckboxField = "CheckboxField"
}
export declare enum MetadataSource {
    Manual = "Manual",
    Signal = "Signal",
    Incremental = "Incremental"
}
export declare class BatchDefinition extends ConfigurationEntity {
    ParallelBatchesEnabled: boolean;
    BatchTriggers: TriggerDefinition[];
    ReleaseSettings: BatchReleaseSettings;
    MetadataFields: {
        [key: string]: MetadataField;
    };
    BatchValueObjects: BatchValueObject[];
    ConditionEventEntries: ConditionEventEntry[];
    BatchReportIds: string[];
    BatchReportExportSettings: BatchReportExportSettings[];
    BatchReviewSettings: BatchReviewSettings;
    constructor();
}
export declare class TriggerDefinition {
    TriggerType: TriggerType;
    ActionType: BatchAction;
    EntityId: string;
    TriggerOn: EventTriggerState | null;
}
export declare class BatchReleaseSettings {
    Enabled: boolean;
    SignalId: string;
    ReleaseValue: any;
}
export declare class BatchValueObject {
    Type: ValueObjectType;
    EntityId: string;
}
export declare class ConditionEventEntry {
    Type: EventEntityType;
    EntityId: string;
}
export declare class MetadataField {
    Name: string;
    Type: MetadataFieldType;
    Source: MetadataSource;
    SignalId: string;
    IncrementalCounterStart: number;
    Optional: boolean;
    Editable: boolean;
    OrderSpecific: boolean;
    WritebackSignalId: string;
    WritebackResetValue: any;
    ObligatoryAt: BatchAction;
    Settings: CustomFieldSettings;
}
export declare class BatchReportExportSettings {
    ReportId: string;
    TemplateId: string;
    Enabled: boolean;
    FileNameTemplate: string;
    Actions: EventAction[];
    StorageType: ReportStorageType;
}
export declare class BatchReviewSettings {
    Enabled: boolean;
    Reviews: BatchReviewDefinition[];
    Ordered: boolean;
}
export declare class BatchReviewDefinition {
    Name: TranslatableField<string>;
    Instructions: TranslatableField<string>;
    Reviewers: string[];
}
