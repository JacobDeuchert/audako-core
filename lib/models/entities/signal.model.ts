import { Type } from '../../interfaces/type.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum SignalType {
  AnalogInput = 'AnalogInput',
  AnalogInOut = 'AnalogInOut',
  DigitalInput = 'DigitalInput',
  DigitalInOut = 'DigitalInOut',
  Counter = 'Counter',
  UniversalInput = 'UniversalInput',
  UniversalInOut = 'UniversalInOut',
}

export class Signal extends ConfigurationEntity {
  public Type: Field<SignalType>;
  public DataConnectionId: Field<string>;
  public Address: Field<string>;

  public Settings: SignalSettings;

  public RecordingSettings: SignalRecordingSettings;

  public CompressionSettings: SignalCompressionSettings;

  constructor() {
    super();
    this.Type = new Field<SignalType>();
    this.DataConnectionId = new Field<string>();
    this.Address = new Field<string>();
    this.Settings = new SignalSettings();
    this.RecordingSettings = new SignalRecordingSettings();
  }
}

export class SignalSettings {
  public _t: string;
}

export class SignalDigitalSettings extends SignalSettings {
  public DigitalTrueColor: Field<string>;
  public DigitalTrueCaption: Field<string>;

  public DigitalFalseColor: Field<string>;
  public DigitalFalseCaption: Field<string>;

  public Invert: Field<boolean>;

  public BitSelect: Field<number>;
  public BitSelectConversion: Field<string>;
}

export class SignalAnalogSettings extends SignalSettings {
  public MinValue: Field<number>;
  public MaxValue: Field<number>;
  public DefaultValue: Field<number>;

  public DecimalPlaces: Field<number>;
  public Unit: Field<string>;

  public Factor: Field<number>;
  public Offset: Field<number>;
}

export class SignalCounterSettings extends SignalSettings {
  public MaxValue: Field<number>;

  public OffsetAutomatic: Field<boolean>;
  public OffsetDetection: Field<boolean>;

  public DecimalPlaces: Field<number>;
  public Unit: Field<string>;

  public Factor: Field<number>;
  public Offset: Field<number>;
}

export const SignalTypeSettingsMap: Record<SignalType, Type<SignalSettings> | null> = {
  AnalogInput: SignalAnalogSettings,
  AnalogInOut: SignalAnalogSettings,
  DigitalInput: SignalDigitalSettings,
  DigitalInOut: SignalDigitalSettings,
  Counter: SignalCounterSettings,
  UniversalInput: null,
  UniversalInOut: null
}

export enum RecordingSpecialProcessingType {
  None = 'None',
  LiveFlowMeter = 'LiveFlowMeter',
  Watchdog = 'Watchdog'
}
export enum RecordingType {
  MeanValue = 'MeanValue',
  LastValue = 'LastValue'
}


export class SignalRecordingSettings {
  SpecialProcessingType: Field<RecordingSpecialProcessingType>;
  Type: Field<RecordingType> = new Field<RecordingType>();
  Interval: Field<number> = new Field<number>();

  constructor() {
    this.SpecialProcessingType = new Field<RecordingSpecialProcessingType>();
    this.Type = new Field<RecordingType>();
    this.Interval = new Field<number>();
  }
}

export enum SignalCompressionType {
  None = 'None',
  WeightedMean = 'WeightedMean',
  ArithmeticMean = 'ArithmeticMean',
  Difference = 'Difference',
  Sum = 'Sum',
  Time = 'Time',
  Text = 'Text'
}

export class SignalCompressionSettings {
  Timezones: Field<string[]>  = new Field<string[]>();
  SubIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  HourIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  TwoHourIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  DayIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  WeekIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  MonthIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  QuarterIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();
  YearIntervalCompressionType: Field<SignalCompressionType> = new Field<SignalCompressionType>();

  constructor() {
    this.Timezones = new Field<string[]>([]);
    this.SubIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.HourIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.TwoHourIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.DayIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.WeekIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.MonthIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.QuarterIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
    this.YearIntervalCompressionType = new Field<SignalCompressionType>(SignalCompressionType.None);
  }
}