import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var SignalType;
(function (SignalType) {
    SignalType["AnalogInput"] = "AnalogInput";
    SignalType["AnalogInOut"] = "AnalogInOut";
    SignalType["DigitalInput"] = "DigitalInput";
    SignalType["DigitalInOut"] = "DigitalInOut";
    SignalType["Counter"] = "Counter";
    SignalType["UniversalInput"] = "UniversalInput";
    SignalType["UniversalInOut"] = "UniversalInOut";
})(SignalType || (SignalType = {}));
export class Signal extends ConfigurationEntity {
    constructor() {
        super();
        this.Type = new Field();
        this.DataConnectionId = new Field();
        this.Address = new Field();
        this.Settings = new SignalSettings();
        this.RecordingSettings = new SignalRecordingSettings();
    }
}
export class SignalSettings {
}
export class SignalDigitalSettings extends SignalSettings {
}
export class SignalAnalogSettings extends SignalSettings {
}
export class SignalCounterSettings extends SignalSettings {
}
export const SignalTypeSettingsMap = {
    AnalogInput: SignalAnalogSettings,
    AnalogInOut: SignalAnalogSettings,
    DigitalInput: SignalDigitalSettings,
    DigitalInOut: SignalDigitalSettings,
    Counter: SignalCounterSettings,
    UniversalInput: null,
    UniversalInOut: null
};
export var RecordingSpecialProcessingType;
(function (RecordingSpecialProcessingType) {
    RecordingSpecialProcessingType["None"] = "None";
    RecordingSpecialProcessingType["LiveFlowMeter"] = "LiveFlowMeter";
    RecordingSpecialProcessingType["Watchdog"] = "Watchdog";
})(RecordingSpecialProcessingType || (RecordingSpecialProcessingType = {}));
export var RecordingType;
(function (RecordingType) {
    RecordingType["MeanValue"] = "MeanValue";
    RecordingType["LastValue"] = "LastValue";
})(RecordingType || (RecordingType = {}));
export class SignalRecordingSettings {
    constructor() {
        this.Type = new Field();
        this.Interval = new Field();
        this.SpecialProcessingType = new Field();
        this.Type = new Field();
        this.Interval = new Field();
    }
}
export var SignalCompressionType;
(function (SignalCompressionType) {
    SignalCompressionType["None"] = "None";
    SignalCompressionType["WeightedMean"] = "WeightedMean";
    SignalCompressionType["ArithmeticMean"] = "ArithmeticMean";
    SignalCompressionType["Difference"] = "Difference";
    SignalCompressionType["Sum"] = "Sum";
    SignalCompressionType["Time"] = "Time";
    SignalCompressionType["Text"] = "Text";
})(SignalCompressionType || (SignalCompressionType = {}));
export class SignalCompressionSettings {
    constructor() {
        this.Timezones = new Field();
        this.SubIntervalCompressionType = new Field();
        this.HourIntervalCompressionType = new Field();
        this.TwoHourIntervalCompressionType = new Field();
        this.DayIntervalCompressionType = new Field();
        this.WeekIntervalCompressionType = new Field();
        this.MonthIntervalCompressionType = new Field();
        this.QuarterIntervalCompressionType = new Field();
        this.YearIntervalCompressionType = new Field();
        this.Timezones = new Field([]);
        this.SubIntervalCompressionType = new Field(SignalCompressionType.None);
        this.HourIntervalCompressionType = new Field(SignalCompressionType.None);
        this.TwoHourIntervalCompressionType = new Field(SignalCompressionType.None);
        this.DayIntervalCompressionType = new Field(SignalCompressionType.None);
        this.WeekIntervalCompressionType = new Field(SignalCompressionType.None);
        this.MonthIntervalCompressionType = new Field(SignalCompressionType.None);
        this.QuarterIntervalCompressionType = new Field(SignalCompressionType.None);
        this.YearIntervalCompressionType = new Field(SignalCompressionType.None);
    }
}
