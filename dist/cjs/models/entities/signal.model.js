"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalCompressionSettings = exports.SignalCompressionType = exports.SignalRecordingSettings = exports.RecordingType = exports.RecordingSpecialProcessingType = exports.SignalTypeSettingsMap = exports.SignalCounterSettings = exports.SignalAnalogSettings = exports.SignalDigitalSettings = exports.SignalSettings = exports.Signal = exports.SignalType = void 0;
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
        this.Type = new configuration_entity_model_js_1.Field();
        this.DataConnectionId = new configuration_entity_model_js_1.Field();
        this.Address = new configuration_entity_model_js_1.Field();
        this.Settings = null;
        this.RecordingSettings = new SignalRecordingSettings();
    }
}
exports.Signal = Signal;
class SignalSettings {
    constructor(_t) {
        this._t = _t;
    }
}
exports.SignalSettings = SignalSettings;
class SignalDigitalSettings extends SignalSettings {
    constructor() {
        super('SignalDigitalSettings');
    }
}
exports.SignalDigitalSettings = SignalDigitalSettings;
class SignalAnalogSettings extends SignalSettings {
    constructor() {
        super('SignalAnalogSettings');
    }
}
exports.SignalAnalogSettings = SignalAnalogSettings;
class SignalCounterSettings extends SignalSettings {
    constructor() {
        super('SignalCounterSettings');
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
        this.Type = new configuration_entity_model_js_1.Field();
        this.Interval = new configuration_entity_model_js_1.Field();
        this.SpecialProcessingType = new configuration_entity_model_js_1.Field();
        this.Type = new configuration_entity_model_js_1.Field();
        this.Interval = new configuration_entity_model_js_1.Field();
    }
}
exports.SignalRecordingSettings = SignalRecordingSettings;
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
        this.SubIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.HourIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.TwoHourIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.DayIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.WeekIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.MonthIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.QuarterIntervalCompressionType = new configuration_entity_model_js_1.Field();
        this.YearIntervalCompressionType = new configuration_entity_model_js_1.Field();
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
