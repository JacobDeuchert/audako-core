import { ConfigurationEntity, Field } from './configuration-entity.model';

export class EventCondition extends ConfigurationEntity {
  public Settings: ConditionSettings;
}

export enum EventConditionSettingsType {
  SignalConditionSettings = 'SignalConditionSettings',
  DataConnectionFailureConditionSettings = 'DataConnectionFailureConditionSettings',
}

export class ConditionSettings {
  public _t: EventConditionSettingsType;
}

export class SignalConditionSettings extends ConditionSettings {
  public InConditionOperator: Field<string>;
  public OutConditionOperator: Field<string>;
  public InConditionValue: Field<string>;
  public OutConditionValue: Field<string>;

  public InDelay: Field<number>;
  public OutDelay: Field<number>;

  public SignalId: Field<string>;
}

export class DataConnectionFailureConditionSettings extends ConditionSettings {
  public MaxOfflineTimeout: Field<number>;

  public DataConnectionId: Field<string>;
}
