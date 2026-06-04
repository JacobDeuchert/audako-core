import { CompressionInterval, ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class EventCondition extends ConfigurationEntity {
  public Enabled: Field<boolean>;
  public Settings: ConditionSettings;

  constructor() {
    super();
    this.Enabled = new Field<boolean>(true);
  }
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

export abstract class ConditionSettings {
  public _t: EventConditionSettingsType;

  constructor(type: EventConditionSettingsType) {
    this._t = type;
  }
}

export class SignalConditionSettings extends ConditionSettings {
  public InConditionOperator: Field<SignalConditionSettingsOperator>;
  public OutConditionOperator: Field<SignalConditionSettingsOperator>;
  public InConditionValue: Field<any>;
  public OutConditionValue: Field<any>;

  public InDelay: Field<number>;
  public OutDelay: Field<number>;

  public SignalId: Field<string>;

  constructor() {
    super(EventConditionSettingsType.SignalConditionSettings);
    this.InConditionOperator = new Field<SignalConditionSettingsOperator>();
    this.OutConditionOperator = new Field<SignalConditionSettingsOperator>();
    this.InConditionValue = new Field<any>();
    this.OutConditionValue = new Field<any>();
    this.InDelay = new Field<number>();
    this.OutDelay = new Field<number>();
    this.SignalId = new Field<string>();
  }
}

export class CounterConditionSettings extends ConditionSettings {
  public SignalId: Field<string>;
  public Value: Field<number>;
  public StartValue: Field<number>;
  public StartDate: Field<Date>;
  public DelayedTriggeringEnabled: Field<boolean>;

  constructor() {
    super(EventConditionSettingsType.CounterConditionSettings);
    this.SignalId = new Field<string>();
    this.Value = new Field<number>();
    this.StartValue = new Field<number>();
    this.StartDate = new Field<Date>();
    this.DelayedTriggeringEnabled = new Field<boolean>(false);
  }
}

export class ConnectionFailureConditionSettings extends ConditionSettings {
  public MaxOfflineTime: Field<number>;

  public DataSourceId: Field<string>;

  constructor() {
    super(EventConditionSettingsType.ConnectionFailureConditionSettings);
    this.MaxOfflineTime = new Field<number>();
    this.DataSourceId = new Field<string>();
  }
}

export class DataConnectionFailureConditionSettings extends ConditionSettings {
  public MaxOfflineTime: Field<number>;

  public DataConnectionId: Field<string>;

  constructor() {
    super(EventConditionSettingsType.DataConnectionFailure);
    this.MaxOfflineTime = new Field<number>();
    this.DataConnectionId = new Field<string>();
  }
}

export class TimebasedConditionSettings extends ConditionSettings {
  public RRule: string;

  public StartsAt: Date;
  public StartTime: string;
  public EndsAt: Date;
  public EndTime: string;

  public DelayedTriggeringEnabled: boolean;
  public TriggerMissedOnAdd: boolean;
  public SubsequentTriggeringEnabled: boolean;

  public Timezone: string;

  constructor() {
    super(EventConditionSettingsType.TimebasedConditionSettings);
    this.DelayedTriggeringEnabled = false;
    this.TriggerMissedOnAdd = false;
    this.SubsequentTriggeringEnabled = false;
  }
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

  constructor() {
    super(EventConditionSettingsType.MinimumMonitoringSettings);
  }
}

export class MaximumMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;
  public MaximumValue: number | boolean | string;
  public ValueIntervalType: CompressionInterval;
  public TimeZone: string;

  constructor() {
    super(EventConditionSettingsType.MaximumMonitoringSettings);
  }
}

export class PeriodMaximumMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;
  public ValueIntervalType: CompressionInterval;
  public TimeZone: string;

  public Periods: PeriodMaximumMonitoringSettingsPeriod[];

  constructor() {
    super(EventConditionSettingsType.PeriodMaximumMonitoringSettings);
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

  constructor() {
    super(EventConditionSettingsType.ChangeRateMonitoringSettings);
  }
}

export class PlausibilityMonitoringSettings extends ConditionSettings {
  public ObjectType: ValueObjectType;
  public ObjectId: string;

  public MinimumValue: number | string | boolean;
  public MaximumValue: number | string | boolean;

  public ValueIntervalType: CompressionInterval;
  public TimeZone: string;

  constructor() {
    super(EventConditionSettingsType.PlausibilityMonitoringSettings);
  }
}

export class PositionMonitoringSettings extends ConditionSettings {
  public LongitudeObjectId: string;
  public LatitudeObjectId: string;

  public FixedLongitude: number;
  public FixedLatitude: number;
  public FixedDistance: number;

  constructor() {
    super(EventConditionSettingsType.PositionMonitoringSettings);
  }
}

export class RecordingFailureMonitoringSettings extends ConditionSettings {
  public SignalId: Field<string>;

  public MaxOutageTime: Field<number>;

  constructor() {
    super(EventConditionSettingsType.RecordingFailureMonitoringSettings);
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

  constructor() {
    super(EventConditionSettingsType.DifferenceMonitoringSettings);
  }
}

export class ObjectSettings {
  ObjectId: string;
  ObjectType: ValueObjectType;
}
