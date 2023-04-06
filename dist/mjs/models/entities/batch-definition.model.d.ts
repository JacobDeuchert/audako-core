import { ConfigurationEntity } from './configuration-entity.model.js';
export declare class BatchDefinition extends ConfigurationEntity {
    ParallelBatchesEnabled: boolean;
    BatchTrigger: BatchTriggerDefinition[];
}
export declare enum BatchTriggerType {
    EventDefinition = "EventDefinition",
    Condition = "Condition",
    Manual = "Manual"
}
export declare enum BatchTriggerState {
    Raised = "Raised",
    Dropped = "Dropped"
}
export declare class TriggerDefinition {
    TriggerType: any;
}
export declare class BatchTriggerDefinition {
    TriggerType: BatchTriggerType;
    ActionType: 'Start' | 'Stop';
    EntityId: string;
    TriggerOn: BatchTriggerState;
}
