import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class RuntimeScript extends ConfigurationEntity {
    Triggers: ScriptTrigger[];
    StaticVariables: StaticScriptVariable[];
    Script: Field<string>;
    Enabled: Field<boolean>;
    constructor();
}
export declare class StaticScriptVariable {
    Name: Field<string>;
    Value: Field<string>;
    constructor();
}
export declare abstract class ScriptTrigger {
    _t: string;
    constructor(typeName?: string);
}
export declare class CyclicTrigger extends ScriptTrigger {
    Interval: Field<number>;
    constructor();
}
export declare enum ScriptEventTriggerState {
    Entered = "Entered",
    Dropped = "Dropped",
    Acknowledged = "Acknowledged"
}
export declare class EventTrigger extends ScriptTrigger {
    State: Field<ScriptEventTriggerState>;
    EventDefinitionId: Field<string>;
    constructor();
}
export declare enum ScriptConditionTriggerState {
    Raised = "Raised",
    Dropped = "Dropped"
}
export declare class ConditionTrigger extends ScriptTrigger {
    State: Field<ScriptConditionTriggerState>;
    ConditionId: Field<string>;
    constructor();
}
export declare enum ScriptBatchTriggerState {
    Started = "Started",
    Stopped = "Stopped"
}
export declare class BatchTrigger extends ScriptTrigger {
    State: Field<ScriptBatchTriggerState>;
    BatchDefinitionId: Field<string>;
    constructor();
}
