import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class RuntimeScript extends ConfigurationEntity {
    constructor() {
        super();
        this.Script = new Field();
        this.Enabled = new Field(true);
    }
}
export class StaticScriptVariable {
    constructor() {
        this.Name = new Field();
        this.Value = new Field();
    }
}
export class ScriptTrigger {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class CyclicTrigger extends ScriptTrigger {
    constructor() {
        super('CyclicTrigger');
        this.Interval = new Field();
    }
}
export var ScriptEventTriggerState;
(function (ScriptEventTriggerState) {
    ScriptEventTriggerState["Entered"] = "Entered";
    ScriptEventTriggerState["Dropped"] = "Dropped";
    ScriptEventTriggerState["Acknowledged"] = "Acknowledged";
})(ScriptEventTriggerState || (ScriptEventTriggerState = {}));
export class EventTrigger extends ScriptTrigger {
    constructor() {
        super('EventTrigger');
        this.State = new Field();
        this.EventDefinitionId = new Field();
    }
}
export var ScriptConditionTriggerState;
(function (ScriptConditionTriggerState) {
    ScriptConditionTriggerState["Raised"] = "Raised";
    ScriptConditionTriggerState["Dropped"] = "Dropped";
})(ScriptConditionTriggerState || (ScriptConditionTriggerState = {}));
export class ConditionTrigger extends ScriptTrigger {
    constructor() {
        super('ConditionTrigger');
        this.State = new Field();
        this.ConditionId = new Field();
    }
}
export var ScriptBatchTriggerState;
(function (ScriptBatchTriggerState) {
    ScriptBatchTriggerState["Started"] = "Started";
    ScriptBatchTriggerState["Stopped"] = "Stopped";
})(ScriptBatchTriggerState || (ScriptBatchTriggerState = {}));
export class BatchTrigger extends ScriptTrigger {
    constructor() {
        super('BatchTrigger');
        this.State = new Field();
        this.BatchDefinitionId = new Field();
    }
}
