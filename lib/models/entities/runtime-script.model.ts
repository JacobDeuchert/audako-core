import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class RuntimeScript extends ConfigurationEntity {
  public Triggers: ScriptTrigger[];
  public StaticVariables: StaticScriptVariable[];
  public Script: Field<string>;
  public Enabled: Field<boolean>;

  constructor() {
    super();
    this.Script = new Field<string>();
    this.Enabled = new Field<boolean>(true);
  }
}

export class StaticScriptVariable {
  public Name: Field<string>;
  public Value: Field<string>;

  constructor() {
    this.Name = new Field<string>();
    this.Value = new Field<string>();
  }
}

export abstract class ScriptTrigger {
  public _t: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class CyclicTrigger extends ScriptTrigger {
  public Interval: Field<number>;

  constructor() {
    super('CyclicTrigger');
    this.Interval = new Field<number>();
  }
}

export enum ScriptEventTriggerState {
  Entered = 'Entered',
  Dropped = 'Dropped',
  Acknowledged = 'Acknowledged',
}

export class EventTrigger extends ScriptTrigger {
  public State: Field<ScriptEventTriggerState>;
  public EventDefinitionId: Field<string>;

  constructor() {
    super('EventTrigger');
    this.State = new Field<ScriptEventTriggerState>();
    this.EventDefinitionId = new Field<string>();
  }
}

export enum ScriptConditionTriggerState {
  Raised = 'Raised',
  Dropped = 'Dropped',
}

export class ConditionTrigger extends ScriptTrigger {
  public State: Field<ScriptConditionTriggerState>;
  public ConditionId: Field<string>;

  constructor() {
    super('ConditionTrigger');
    this.State = new Field<ScriptConditionTriggerState>();
    this.ConditionId = new Field<string>();
  }
}

export enum ScriptBatchTriggerState {
  Started = 'Started',
  Stopped = 'Stopped',
}

export class BatchTrigger extends ScriptTrigger {
  public State: Field<ScriptBatchTriggerState>;
  public BatchDefinitionId: Field<string>;

  constructor() {
    super('BatchTrigger');
    this.State = new Field<ScriptBatchTriggerState>();
    this.BatchDefinitionId = new Field<string>();
  }
}
