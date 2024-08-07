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

  public Alias: Field<string>;
  public DataConnectionId: Field<string>;
  public Address: Field<string>;

  public Settings: SignalSettings;

  public RecordingSettings: SignalRecordingSettings;

  public CompressionSettings: SignalCompressionSettings;

  constructor() {
    super();
    this.Alias = new Field<string>();
    this.Type = new Field<SignalType>();
    this.DataConnectionId = new Field<string>();
    this.Address = new Field<string>();
    this.Settings = null;
    this.RecordingSettings = new SignalRecordingSettings();
    this.CompressionSettings = new SignalCompressionSettings();
  }
}

export enum BitSelectConversionTypes {
  None = 'None',
  SByte = 'SByte',
  Short = 'Short',
  Int = 'Int',
}

export class SignalSettings {

  constructor(public _t: string) {}
}

export class SignalDigitalSettings extends SignalSettings {
  public DigitalTrueColor: Field<string>;
  public DigitalTrueCaption: Field<string>;

  public DigitalFalseColor: Field<string>;
  public DigitalFalseCaption: Field<string>;

  public Invert: Field<boolean>;

  public BitSelect: Field<number>;
  public BitSelectConversion: Field<BitSelectConversionTypes>;

  constructor() {
    super('SignalDigitalSettings')

    this.DigitalTrueColor = new Field<string>();
    this.DigitalTrueCaption = new Field<string>();
    this.DigitalFalseColor = new Field<string>();
    this.DigitalFalseCaption = new Field<string>();
    this.Invert = new Field<boolean>();
    this.BitSelect = new Field<number>();
    this.BitSelectConversion = new Field<BitSelectConversionTypes>(BitSelectConversionTypes.None);
  }
}

export class SignalAnalogSettings extends SignalSettings {
  public MinValue: Field<number>;
  public MaxValue: Field<number>;
  public DefaultValue: Field<number>;

  public DecimalPlaces: Field<number>;
  public Unit: Field<string>;

  public Factor: Field<number>;
  public Offset: Field<number>;

  constructor() {
    super('SignalAnalogSettings')

    this.MinValue = new Field<number>();
    this.MaxValue = new Field<number>();
    this.DefaultValue = new Field<number>();
    this.DecimalPlaces = new Field<number>();
    this.Unit = new Field<string>();
    this.Factor = new Field<number>();
    this.Offset = new Field<number>();
  }
}

export class SignalCounterSettings extends SignalSettings {
  public MaxValue: Field<number>;

  public OffsetAutomatic: Field<boolean>;
  public OffsetDetection: Field<boolean>;

  public DecimalPlaces: Field<number>;
  public Unit: Field<string>;

  public Factor: Field<number>;
  public Offset: Field<number>;


  constructor() {
    super('SignalCounterSettings')

    this.MaxValue = new Field<number>();
    this.OffsetAutomatic = new Field<boolean>();
    this.OffsetDetection = new Field<boolean>();
    this.DecimalPlaces = new Field<number>();
    this.Unit = new Field<string>();
    this.Factor = new Field<number>();
    this.Offset = new Field<number>();
  }
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

export function getDefaultCompressionSettingsBySignalType(type: SignalType): SignalCompressionSettings {
  const compressionSettings = new SignalCompressionSettings();
  if (type === SignalType.AnalogInput || type === SignalType.AnalogInOut) {
    compressionSettings.SubIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.HourIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.TwoHourIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.DayIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.WeekIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.MonthIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.QuarterIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
    compressionSettings.YearIntervalCompressionType.Value = SignalCompressionType.ArithmeticMean;
  } else if (type === SignalType.Counter) {
    compressionSettings.SubIntervalCompressionType.Value = SignalCompressionType.Sum;
    compressionSettings.HourIntervalCompressionType.Value = SignalCompressionType.Sum;
    compressionSettings.TwoHourIntervalCompressionType.Value = SignalCompressionType.Sum;
    compressionSettings.DayIntervalCompressionType.Value = SignalCompressionType.Sum;
    compressionSettings.WeekIntervalCompressionType.Value = SignalCompressionType.Difference;
    compressionSettings.MonthIntervalCompressionType.Value = SignalCompressionType.Difference;
    compressionSettings.QuarterIntervalCompressionType.Value = SignalCompressionType.Difference;
    compressionSettings.YearIntervalCompressionType.Value = SignalCompressionType.Difference;
  }

  return compressionSettings;
}