"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchTriggerDefinition = exports.TriggerDefinition = exports.BatchTriggerState = exports.BatchTriggerType = exports.BatchDefinition = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class BatchDefinition extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.BatchDefinition = BatchDefinition;
var BatchTriggerType;
(function (BatchTriggerType) {
    BatchTriggerType["EventDefinition"] = "EventDefinition";
    BatchTriggerType["Condition"] = "Condition";
    BatchTriggerType["Manual"] = "Manual";
})(BatchTriggerType = exports.BatchTriggerType || (exports.BatchTriggerType = {}));
var BatchTriggerState;
(function (BatchTriggerState) {
    BatchTriggerState["Raised"] = "Raised";
    BatchTriggerState["Dropped"] = "Dropped";
})(BatchTriggerState = exports.BatchTriggerState || (exports.BatchTriggerState = {}));
class TriggerDefinition {
}
exports.TriggerDefinition = TriggerDefinition;
class BatchTriggerDefinition {
}
exports.BatchTriggerDefinition = BatchTriggerDefinition;
