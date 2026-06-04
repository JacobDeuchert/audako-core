"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchTrigger = exports.ScriptBatchTriggerState = exports.ConditionTrigger = exports.ScriptConditionTriggerState = exports.EventTrigger = exports.ScriptEventTriggerState = exports.CyclicTrigger = exports.ScriptTrigger = exports.StaticScriptVariable = exports.RuntimeScript = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class RuntimeScript extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Script = new configuration_entity_model_js_1.Field();
        this.Enabled = new configuration_entity_model_js_1.Field(true);
    }
}
exports.RuntimeScript = RuntimeScript;
class StaticScriptVariable {
    constructor() {
        this.Name = new configuration_entity_model_js_1.Field();
        this.Value = new configuration_entity_model_js_1.Field();
    }
}
exports.StaticScriptVariable = StaticScriptVariable;
class ScriptTrigger {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.ScriptTrigger = ScriptTrigger;
class CyclicTrigger extends ScriptTrigger {
    constructor() {
        super('CyclicTrigger');
        this.Interval = new configuration_entity_model_js_1.Field();
    }
}
exports.CyclicTrigger = CyclicTrigger;
var ScriptEventTriggerState;
(function (ScriptEventTriggerState) {
    ScriptEventTriggerState["Entered"] = "Entered";
    ScriptEventTriggerState["Dropped"] = "Dropped";
    ScriptEventTriggerState["Acknowledged"] = "Acknowledged";
})(ScriptEventTriggerState || (exports.ScriptEventTriggerState = ScriptEventTriggerState = {}));
class EventTrigger extends ScriptTrigger {
    constructor() {
        super('EventTrigger');
        this.State = new configuration_entity_model_js_1.Field();
        this.EventDefinitionId = new configuration_entity_model_js_1.Field();
    }
}
exports.EventTrigger = EventTrigger;
var ScriptConditionTriggerState;
(function (ScriptConditionTriggerState) {
    ScriptConditionTriggerState["Raised"] = "Raised";
    ScriptConditionTriggerState["Dropped"] = "Dropped";
})(ScriptConditionTriggerState || (exports.ScriptConditionTriggerState = ScriptConditionTriggerState = {}));
class ConditionTrigger extends ScriptTrigger {
    constructor() {
        super('ConditionTrigger');
        this.State = new configuration_entity_model_js_1.Field();
        this.ConditionId = new configuration_entity_model_js_1.Field();
    }
}
exports.ConditionTrigger = ConditionTrigger;
var ScriptBatchTriggerState;
(function (ScriptBatchTriggerState) {
    ScriptBatchTriggerState["Started"] = "Started";
    ScriptBatchTriggerState["Stopped"] = "Stopped";
})(ScriptBatchTriggerState || (exports.ScriptBatchTriggerState = ScriptBatchTriggerState = {}));
class BatchTrigger extends ScriptTrigger {
    constructor() {
        super('BatchTrigger');
        this.State = new configuration_entity_model_js_1.Field();
        this.BatchDefinitionId = new configuration_entity_model_js_1.Field();
    }
}
exports.BatchTrigger = BatchTrigger;
