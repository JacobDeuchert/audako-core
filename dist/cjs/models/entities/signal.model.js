"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultCompressionSettingsBySignalType = exports.SignalCompressionSettings = exports.SignalCompressionType = exports.getDefaultRecordingSettingsBySignalType = exports.SignalRecordingSettings = exports.RecordingType = exports.RecordingSpecialProcessingType = exports.SignalTypeSettingsMap = exports.SignalCounterSettings = exports.SignalAnalogSettings = exports.SignalDigitalSettings = exports.SignalSettings = exports.BitSelectConversionTypes = exports.Signal = exports.SignalType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var SignalType;
(function (SignalType) {
    SignalType["AnalogInput"] = "AnalogInput";
    SignalType["AnalogInOut"] = "AnalogInOut";
    SignalType["DigitalInput"] = "DigitalInput";
    SignalType["DigitalInOut"] = "DigitalInOut";
    SignalType["Counter"] = "Counter";
    SignalType["UniversalInput"] = "UniversalInput";
    SignalType["UniversalInOut"] = "UniversalInOut";
})(SignalType || (exports.SignalType = SignalType = {}));
class Signal extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Alias = new configuration_entity_model_js_1.Field();
        this.Type = new configuration_entity_model_js_1.Field(SignalType.AnalogInput);
        this.DataConnectionId = new configuration_entity_model_js_1.Field();
        this.Address = new configuration_entity_model_js_1.Field();
        this.Settings = new SignalAnalogSettings();
        this.RecordingSettings = new SignalRecordingSettings();
        this.CompressionSettings = new SignalCompressionSettings();
    }
}
exports.Signal = Signal;
var BitSelectConversionTypes;
(function (BitSelectConversionTypes) {
    BitSelectConversionTypes["None"] = "None";
    BitSelectConversionTypes["SByte"] = "SByte";
    BitSelectConversionTypes["Short"] = "Short";
    BitSelectConversionTypes["Int"] = "Int";
})(BitSelectConversionTypes || (exports.BitSelectConversionTypes = BitSelectConversionTypes = {}));
class SignalSettings {
    constructor(_t) {
        this._t = _t;
    }
}
exports.SignalSettings = SignalSettings;
class SignalDigitalSettings extends SignalSettings {
    constructor() {
        super('SignalDigitalSettings');
        this.DigitalTrueColor = new configuration_entity_model_js_1.Field();
        this.DigitalTrueCaption = new configuration_entity_model_js_1.Field();
        this.DigitalFalseColor = new configuration_entity_model_js_1.Field();
        this.DigitalFalseCaption = new configuration_entity_model_js_1.Field();
        this.Invert = new configuration_entity_model_js_1.Field();
        this.BitSelect = new configuration_entity_model_js_1.Field();
        this.BitSelectConversion = new configuration_entity_model_js_1.Field(BitSelectConversionTypes.None);
    }
}
exports.SignalDigitalSettings = SignalDigitalSettings;
class SignalAnalogSettings extends SignalSettings {
    constructor() {
        super('SignalAnalogSettings');
        this.MinValue = new configuration_entity_model_js_1.Field();
        this.MaxValue = new configuration_entity_model_js_1.Field();
        this.DefaultValue = new configuration_entity_model_js_1.Field();
        this.DecimalPlaces = new configuration_entity_model_js_1.Field();
        this.Unit = new configuration_entity_model_js_1.Field();
        this.Factor = new configuration_entity_model_js_1.Field();
        this.Offset = new configuration_entity_model_js_1.Field();
    }
}
exports.SignalAnalogSettings = SignalAnalogSettings;
class SignalCounterSettings extends SignalSettings {
    constructor() {
        super('SignalCounterSettings');
        this.MaxValue = new configuration_entity_model_js_1.Field();
        this.OffsetAutomatic = new configuration_entity_model_js_1.Field();
        this.OffsetDetection = new configuration_entity_model_js_1.Field();
        this.DecimalPlaces = new configuration_entity_model_js_1.Field();
        this.Unit = new configuration_entity_model_js_1.Field();
        this.Factor = new configuration_entity_model_js_1.Field();
        this.Offset = new configuration_entity_model_js_1.Field();
    }
}
exports.SignalCounterSettings = SignalCounterSettings;
exports.SignalTypeSettingsMap = {
    AnalogInput: SignalAnalogSettings,
    AnalogInOut: SignalAnalogSettings,
    DigitalInput: SignalDigitalSettings,
    DigitalInOut: SignalDigitalSettings,
    Counter: SignalCounterSettings,
    UniversalInput: null,
    UniversalInOut: null
};
var RecordingSpecialProcessingType;
(function (RecordingSpecialProcessingType) {
    RecordingSpecialProcessingType["None"] = "None";
    RecordingSpecialProcessingType["LiveFlowMeter"] = "LiveFlowMeter";
    RecordingSpecialProcessingType["Watchdog"] = "Watchdog";
})(RecordingSpecialProcessingType || (exports.RecordingSpecialProcessingType = RecordingSpecialProcessingType = {}));
var RecordingType;
(function (RecordingType) {
    RecordingType["MeanValue"] = "MeanValue";
    RecordingType["LastValue"] = "LastValue";
})(RecordingType || (exports.RecordingType = RecordingType = {}));
class SignalRecordingSettings {
    constructor() {
        this.SpecialProcessingType = new configuration_entity_model_js_1.Field(RecordingSpecialProcessingType.None);
        this.Type = new configuration_entity_model_js_1.Field(RecordingType.MeanValue);
        this.Interval = new configuration_entity_model_js_1.Field(300);
    }
}
exports.SignalRecordingSettings = SignalRecordingSettings;
function getDefaultRecordingSettingsBySignalType(type) {
    const recordingSettings = new SignalRecordingSettings();
    if (type === SignalType.AnalogInput || type === SignalType.AnalogInOut) {
        recordingSettings.Type.Value = RecordingType.MeanValue;
    }
    else if (type === SignalType.Counter || type === SignalType.DigitalInput || type === SignalType.DigitalInOut) {
        recordingSettings.Type.Value = RecordingType.LastValue;
    }
    return recordingSettings;
}
exports.getDefaultRecordingSettingsBySignalType = getDefaultRecordingSettingsBySignalType;
var SignalCompressionType;
(function (SignalCompressionType) {
    SignalCompressionType["None"] = "None";
    SignalCompressionType["WeightedMean"] = "WeightedMean";
    SignalCompressionType["ArithmeticMean"] = "ArithmeticMean";
    SignalCompressionType["Difference"] = "Difference";
    SignalCompressionType["Sum"] = "Sum";
    SignalCompressionType["Time"] = "Time";
    SignalCompressionType["Text"] = "Text";
})(SignalCompressionType || (exports.SignalCompressionType = SignalCompressionType = {}));
class SignalCompressionSettings {
    constructor() {
        this.Timezones = new configuration_entity_model_js_1.Field();
        this.Timezones = new configuration_entity_model_js_1.Field([]);
        this.SubIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.HourIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.TwoHourIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.DayIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.WeekIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.MonthIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.QuarterIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
        this.YearIntervalCompressionType = new configuration_entity_model_js_1.Field(SignalCompressionType.None);
    }
}
exports.SignalCompressionSettings = SignalCompressionSettings;
function getDefaultCompressionSettingsBySignalType(type) {
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
exports.getDefaultCompressionSettingsBySignalType = getDefaultCompressionSettingsBySignalType;
