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
        this.Alias = new Field();
        this.Type = new Field(SignalType.AnalogInput);
        this.DataConnectionId = new Field();
        this.Address = new Field();
        this.Settings = new SignalAnalogSettings();
        this.RecordingSettings = new SignalRecordingSettings();
        this.CompressionSettings = new SignalCompressionSettings();
    }
}
export var BitSelectConversionTypes;
(function (BitSelectConversionTypes) {
    BitSelectConversionTypes["None"] = "None";
    BitSelectConversionTypes["SByte"] = "SByte";
    BitSelectConversionTypes["Short"] = "Short";
    BitSelectConversionTypes["Int"] = "Int";
})(BitSelectConversionTypes || (BitSelectConversionTypes = {}));
export class SignalSettings {
    constructor(_t) {
        this._t = _t;
    }
}
export class SignalDigitalSettings extends SignalSettings {
    constructor() {
        super('SignalDigitalSettings');
        this.DigitalTrueColor = new Field();
        this.DigitalTrueCaption = new Field();
        this.DigitalFalseColor = new Field();
        this.DigitalFalseCaption = new Field();
        this.Invert = new Field();
        this.BitSelect = new Field();
        this.BitSelectConversion = new Field(BitSelectConversionTypes.None);
    }
}
export class SignalAnalogSettings extends SignalSettings {
    constructor() {
        super('SignalAnalogSettings');
        this.MinValue = new Field();
        this.MaxValue = new Field();
        this.DefaultValue = new Field();
        this.DecimalPlaces = new Field();
        this.Unit = new Field();
        this.Factor = new Field();
        this.Offset = new Field();
    }
}
export class SignalCounterSettings extends SignalSettings {
    constructor() {
        super('SignalCounterSettings');
        this.MaxValue = new Field();
        this.OffsetAutomatic = new Field();
        this.OffsetDetection = new Field();
        this.DecimalPlaces = new Field();
        this.Unit = new Field();
        this.Factor = new Field();
        this.Offset = new Field();
    }
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
        this.SpecialProcessingType = new Field(RecordingSpecialProcessingType.None);
        this.Type = new Field(RecordingType.MeanValue);
        this.Interval = new Field(300);
    }
}
export function getDefaultRecordingSettingsBySignalType(type) {
    const recordingSettings = new SignalRecordingSettings();
    if (type === SignalType.AnalogInput || type === SignalType.AnalogInOut) {
        recordingSettings.Type.Value = RecordingType.MeanValue;
    }
    else if (type === SignalType.Counter || type === SignalType.DigitalInput || type === SignalType.DigitalInOut) {
        recordingSettings.Type.Value = RecordingType.LastValue;
    }
    return recordingSettings;
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
export function getDefaultCompressionSettingsBySignalType(type) {
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
    }
    else if (type === SignalType.Counter) {
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
