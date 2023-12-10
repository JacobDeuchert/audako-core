import { CompressionInterval, ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class EventCondition extends ConfigurationEntity {
  public Settings: ConditionSettings;
}

export enum EventConditionSettingsType {
  SignalConditionSettings = 'SignalConditionSettings',
  MinimumMonitoringSettings = 'MinimumMonitoringSettings',
  MaximumMonitoringSettings = 'MaximumMonitoringSettings',
  PeriodMaximumMonitoringSettings = 'PeriodMaximumMonitoringSettings',
  ChangeRateMonitoringSettings = 'ChangeRateMonitoringSettings',
  PlausibilityMonitoringSettings = 'PlausibilityMonitoringSettings',
  PositionMonitoringSettings = 'PositionMonitoringSettings',
  CounterConditionSettings = 'CounterConditionSettings',
  TimebasedConditionSettings = 'TimebasedConditionSettings',
  ConnectionFailureConditionSettings = 'ConnectionFailureConditionSettings',
  DataConnectionFailure = 'DataConnectionFailure',
  DifferenceMonitoringSettings = 'DifferenceMonitoringSettings',
  RecordingFailureMonitoringSettings = 'RecordingFailureMonitoringSettings',
}

export enum SignalConditionSettingsOperator {
  Equal = 'Equal',
  GreaterThan = 'GreaterThan',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  LessThan = 'LessThan',
  LessThanOrEqual = 'LessThanOrEqual',
  NotEqual = 'NotEqual',
}


export class ConditionSettings {
  public _t: EventConditionSettingsType;
}

export class SignalConditionSettings extends ConditionSettings {
  public InConditionOperator: Field<SignalConditionSettingsOperator>;
  public OutConditionOperator: Field<SignalConditionSettingsOperator>;
  public InConditionValue: Field<string>;
  public OutConditionValue: Field<string>;

  public InDelay: Field<number>;
  public OutDelay: Field<number>;

  public SignalId: Field<string>;
}

export class CounterConditionSettings extends ConditionSettings {
  public SignalId: Field<string>;
  public Value: Field<number>;
  public StartValue: Field<number>;
  public StartDate: Field<Date>;
}

export class ConnectionFailureConditionSettings extends ConditionSettings {
  public MaxOfflineTime: Field<number>;

  public DataSourceId: Field<string>;
}

export class DataConnectionFailureConditionSettings extends ConditionSettings {
  public MaxOfflineTimeout: Field<number>;

  public DataConnectionId: Field<string>;
}

export class MinimumMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;

  public ValueIntervalType: CompressionInterval;

  public TimeZone: string;

  public MinimumValue: number | boolean | string;
  public MinimumFrom: string;
  public MinimumTill: string;
  public MinimumEvent: string;
}

export class MaximumMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;
  public MaximumValue: number | boolean | string;
  public TimeZone: string;
}

export class PeriodMaximumMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;
  public ValueIntervalType: CompressionInterval;
  public TimeZone: string;

  public Periods: PeriodMaximumMonitoringSettingsPeriod[];

  constructor() {
    super();
    this.Periods = [];
  }

}

export class PeriodMaximumMonitoringSettingsPeriod {
  public From: string;
  public Till: string;
  public Value: string | number | boolean;
}

export class ChangeRateMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;

  public TimeZone: string;

  public ValueIntervalType: CompressionInterval;
  public ValueIntervalCount: number;
  public MaximumChangeRate: number | string | boolean;
}

export class PlausibilityMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;

  public MinimumValue: number | string | boolean;
  public MaximumValue: number | string | boolean;

  public ValueIntervalType: CompressionInterval;
  public TimeZone: string;
}

export class PositionMonitoringSettings extends ConditionSettings {
  public LongitudeObjectId: string;
  public LatitudeObjectId: string;

  public FixedLongitude: number;
  public FixedLatitude: number;
  public FixedDistance: number;
}

export class RecordingFailureMonitoringSettings extends ConditionSettings {
  public SignalId: Field<string>;

  public MaxOutageTime: Field<number>;

  constructor() {
    super();
    this._t = EventConditionSettingsType.RecordingFailureMonitoringSettings;
    this.SignalId = new Field<string>(null);
    this.MaxOutageTime = new Field<number>(60000);
  }
}

export class DifferenceMonitoringSettings extends ConditionSettings {
  public CompareObject_A: ObjectSettings;

  public CompareObject_B: ObjectSettings;

  public ValueIntervalType: CompressionInterval;

  public MaximumDifference: number;
  public MaximumTimestampDistance: number;
}

export class ObjectSettings {
  ObjectId: string;
  ObjectType: ValueObjectType;
}
