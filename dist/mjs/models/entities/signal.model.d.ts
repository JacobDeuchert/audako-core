import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum SignalType {
    AnalogInput = "AnalogInput",
    AnalogInOut = "AnalogInOut",
    DigitalInput = "DigitalInput",
    DigitalInOut = "DigitalInOut",
    Counter = "Counter",
    UniversalInput = "UniservalInput",
    UniversalInOut = "UniversalInOut"
}
export declare class Signal extends ConfigurationEntity {
    Type: Field<SignalType>;
    DataConnectionId: Field<string>;
    Address: Field<string>;
    Settings: SignalSettings;
}
export declare class SignalSettings {
    _t: string;
}
export declare class SignalDigitalSettings extends SignalSettings {
    DigitalTrueColor: Field<string>;
    DigitalTrueCaption: Field<string>;
    DigitalFalseColor: Field<string>;
    DigitalFalseCaption: Field<string>;
    Invert: Field<boolean>;
    BitSelect: Field<number>;
    BitSelectConversion: Field<string>;
}
export declare class SignalAnalogSettings extends SignalSettings {
    MinValue: Field<number>;
    MaxValue: Field<number>;
    DefaultValue: Field<number>;
    DecimalPlaces: Field<number>;
    Unit: Field<string>;
    Factor: Field<number>;
    Offset: Field<number>;
}
export declare class SignalCounterSettings extends SignalSettings {
    MaxValue: Field<number>;
    OffsetAutomatic: Field<boolean>;
    OffsetDetection: Field<boolean>;
    DecimalPlaces: Field<number>;
    Unit: Field<string>;
    Factor: Field<number>;
    Offset: Field<number>;
}
