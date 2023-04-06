import { ConfigurationEntity } from './configuration-entity.model.js';

export class BatchDefinition extends ConfigurationEntity {
  public ParallelBatchesEnabled: boolean;
  public BatchTrigger: BatchTriggerDefinition[] 

}

export enum BatchTriggerType {
  EventDefinition = 'EventDefinition',
  Condition = 'Condition',
  Manual = 'Manual'
}

export enum BatchTriggerState {
  Raised = 'Raised',
  Dropped = 'Dropped',
}

export class TriggerDefinition {
  public TriggerType
}

export class BatchTriggerDefinition {
  TriggerType: BatchTriggerType;
  ActionType: 'Start' | 'Stop';

  EntityId: string;
  TriggerOn: BatchTriggerState;
}

