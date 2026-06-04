"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchReviewDefinition = exports.BatchReviewSettings = exports.BatchReportExportSettings = exports.MetadataField = exports.ConditionEventEntry = exports.BatchValueObject = exports.BatchReleaseSettings = exports.TriggerDefinition = exports.BatchDefinition = exports.MetadataSource = exports.MetadataFieldType = exports.EventEntityType = exports.EventTriggerState = exports.TriggerType = exports.BatchAction = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var BatchAction;
(function (BatchAction) {
    BatchAction["Start"] = "Start";
    BatchAction["Stop"] = "Stop";
    BatchAction["Release"] = "Release";
})(BatchAction || (exports.BatchAction = BatchAction = {}));
var TriggerType;
(function (TriggerType) {
    TriggerType["EventDefinition"] = "EventDefinition";
    TriggerType["Condition"] = "Condition";
    TriggerType["Manual"] = "Manual";
})(TriggerType || (exports.TriggerType = TriggerType = {}));
var EventTriggerState;
(function (EventTriggerState) {
    EventTriggerState["Raised"] = "Raised";
    EventTriggerState["Dropped"] = "Dropped";
})(EventTriggerState || (exports.EventTriggerState = EventTriggerState = {}));
var EventEntityType;
(function (EventEntityType) {
    EventEntityType["EventDefinition"] = "EventDefinition";
    EventEntityType["Condition"] = "Condition";
})(EventEntityType || (exports.EventEntityType = EventEntityType = {}));
var MetadataFieldType;
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
})(MetadataFieldType || (exports.MetadataFieldType = MetadataFieldType = {}));
var MetadataSource;
(function (MetadataSource) {
    MetadataSource["Manual"] = "Manual";
    MetadataSource["Signal"] = "Signal";
    MetadataSource["Incremental"] = "Incremental";
})(MetadataSource || (exports.MetadataSource = MetadataSource = {}));
class BatchDefinition extends configuration_entity_model_js_1.ConfigurationEntity {
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
exports.BatchDefinition = BatchDefinition;
class TriggerDefinition {
}
exports.TriggerDefinition = TriggerDefinition;
class BatchReleaseSettings {
    constructor() {
        this.Enabled = false;
        this.SignalId = null;
        this.ReleaseValue = null;
    }
}
exports.BatchReleaseSettings = BatchReleaseSettings;
class BatchValueObject {
}
exports.BatchValueObject = BatchValueObject;
class ConditionEventEntry {
}
exports.ConditionEventEntry = ConditionEventEntry;
class MetadataField {
}
exports.MetadataField = MetadataField;
class BatchReportExportSettings {
}
exports.BatchReportExportSettings = BatchReportExportSettings;
class BatchReviewSettings {
    constructor() {
        this.Enabled = false;
        this.Reviews = [];
        this.Ordered = false;
    }
}
exports.BatchReviewSettings = BatchReviewSettings;
class BatchReviewDefinition {
}
exports.BatchReviewDefinition = BatchReviewDefinition;
