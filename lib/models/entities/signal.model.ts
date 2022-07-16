import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum SignalType {
  AnalogInput = 'AnalogInput',
  AnalogInOut = 'AnalogInOut',
  DigitalInput = 'DigitalInput',
  DigitalInOut = 'DigitalInOut',
  Counter = 'Counter',
  UniversalInput = 'UniservalInput',
  UniversalInOut = 'UniversalInOut',
}

export class Signal extends ConfigurationEntity {
  public Type: Field<SignalType>;
  public DataConnectionId: Field<string>;
  public Address: Field<string>;

  public Settings: SignalSettings;
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
