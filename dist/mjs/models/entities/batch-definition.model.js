import { ConfigurationEntity } from './configuration-entity.model.js';
export class BatchDefinition extends ConfigurationEntity {
}
export var BatchTriggerType;
(function (BatchTriggerType) {
    BatchTriggerType["EventDefinition"] = "EventDefinition";
    BatchTriggerType["Condition"] = "Condition";
    BatchTriggerType["Manual"] = "Manual";
})(BatchTriggerType || (BatchTriggerType = {}));
export var BatchTriggerState;
(function (BatchTriggerState) {
    BatchTriggerState["Raised"] = "Raised";
    BatchTriggerState["Dropped"] = "Dropped";
})(BatchTriggerState || (BatchTriggerState = {}));
export class TriggerDefinition {
}
export class BatchTriggerDefinition {
}
