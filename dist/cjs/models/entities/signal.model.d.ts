import { Type } from '../../interfaces/type.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum SignalType {
    AnalogInput = "AnalogInput",
    AnalogInOut = "AnalogInOut",
    DigitalInput = "DigitalInput",
    DigitalInOut = "DigitalInOut",
    Counter = "Counter",
    UniversalInput = "UniversalInput",
    UniversalInOut = "UniversalInOut"
}
export declare class Signal extends ConfigurationEntity {
    Type: Field<SignalType>;
    DataConnectionId: Field<string>;
    Address: Field<string>;
    Settings: SignalSettings;
    RecordingSettings: SignalRecordingSettings;
    CompressionSettings: SignalCompressionSettings;
    constructor();
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
export declare const SignalTypeSettingsMap: Record<SignalType, Type<SignalSettings> | null>;
export declare enum RecordingSpecialProcessingType {
    None = "None",
    LiveFlowMeter = "LiveFlowMeter",
    Watchdog = "Watchdog"
}
export declare enum RecordingType {
    MeanValue = "MeanValue",
    LastValue = "LastValue"
}
export declare class SignalRecordingSettings {
    SpecialProcessingType: Field<RecordingSpecialProcessingType>;
    Type: Field<RecordingType>;
    Interval: Field<number>;
    constructor();
}
export declare enum SignalCompressionType {
    None = "None",
    WeightedMean = "WeightedMean",
    ArithmeticMean = "ArithmeticMean",
    Difference = "Difference",
    Sum = "Sum",
    Time = "Time",
    Text = "Text"
}
export declare class SignalCompressionSettings {
    Timezones: Field<string[]>;
    SubIntervalCompressionType: Field<SignalCompressionType>;
    HourIntervalCompressionType: Field<SignalCompressionType>;
    TwoHourIntervalCompressionType: Field<SignalCompressionType>;
    DayIntervalCompressionType: Field<SignalCompressionType>;
    WeekIntervalCompressionType: Field<SignalCompressionType>;
    MonthIntervalCompressionType: Field<SignalCompressionType>;
    QuarterIntervalCompressionType: Field<SignalCompressionType>;
    YearIntervalCompressionType: Field<SignalCompressionType>;
    constructor();
}
