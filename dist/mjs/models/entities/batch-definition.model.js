import { ConfigurationEntity } from './configuration-entity.model.js';
export var BatchAction;
(function (BatchAction) {
    BatchAction["Start"] = "Start";
    BatchAction["Stop"] = "Stop";
    BatchAction["Release"] = "Release";
})(BatchAction || (BatchAction = {}));
export var TriggerType;
(function (TriggerType) {
    TriggerType["EventDefinition"] = "EventDefinition";
    TriggerType["Condition"] = "Condition";
    TriggerType["Manual"] = "Manual";
})(TriggerType || (TriggerType = {}));
export var EventTriggerState;
(function (EventTriggerState) {
    EventTriggerState["Raised"] = "Raised";
    EventTriggerState["Dropped"] = "Dropped";
})(EventTriggerState || (EventTriggerState = {}));
export var EventEntityType;
(function (EventEntityType) {
    EventEntityType["EventDefinition"] = "EventDefinition";
    EventEntityType["Condition"] = "Condition";
})(EventEntityType || (EventEntityType = {}));
export var MetadataFieldType;
(function (MetadataFieldType) {
    MetadataFieldType["NumberField"] = "NumberField";
    MetadataFieldType["TextField"] = "TextField";
    MetadataFieldType["BooleanField"] = "BooleanField";
    MetadataFieldType["SelectField"] = "SelectField";
    MetadataFieldType["DateField"] = "DateField";
    MetadataFieldType["CustomMappingField"] = "CustomMappingField";
    MetadataFieldType["UserField"] = "UserField";
    // backwards compatibility types
    MetadataFieldType["TextAreaField"] = "TextAreaField";
    MetadataFieldType["CheckboxField"] = "CheckboxField";
})(MetadataFieldType || (MetadataFieldType = {}));
export var MetadataSource;
(function (MetadataSource) {
    MetadataSource["Manual"] = "Manual";
    MetadataSource["Signal"] = "Signal";
    MetadataSource["Incremental"] = "Incremental";
})(MetadataSource || (MetadataSource = {}));
export class BatchDefinition extends ConfigurationEntity {
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
}
export class BatchReleaseSettings {
    constructor() {
        this.Enabled = false;
        this.SignalId = null;
        this.ReleaseValue = null;
    }
}
export class BatchValueObject {
}
export class ConditionEventEntry {
}
export class MetadataField {
}
export class BatchReportExportSettings {
}
export class BatchReviewSettings {
    constructor() {
        this.Enabled = false;
        this.Reviews = [];
        this.Ordered = false;
    }
}
export class BatchReviewDefinition {
}
