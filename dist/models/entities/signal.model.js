"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalCounterSettings = exports.SignalAnalogSettings = exports.SignalDigitalSettings = exports.SignalSettings = exports.Signal = exports.SignalType = void 0;
const configuration_entity_model_1 = require("./configuration-entity.model");
var SignalType;
(function (SignalType) {
    SignalType["AnalogInput"] = "AnalogInput";
    SignalType["AnalogInOut"] = "AnalogInOut";
    SignalType["DigitalInput"] = "DigitalInput";
    SignalType["DigitalInOut"] = "DigitalInOut";
    SignalType["Counter"] = "Counter";
    SignalType["UniversalInput"] = "UniservalInput";
    SignalType["UniversalInOut"] = "UniversalInOut";
})(SignalType = exports.SignalType || (exports.SignalType = {}));
class Signal extends configuration_entity_model_1.ConfigurationEntity {
}
exports.Signal = Signal;
class SignalSettings {
}
exports.SignalSettings = SignalSettings;
class SignalDigitalSettings extends SignalSettings {
}
exports.SignalDigitalSettings = SignalDigitalSettings;
class SignalAnalogSettings extends SignalSettings {
}
exports.SignalAnalogSettings = SignalAnalogSettings;
class SignalCounterSettings extends SignalSettings {
}
exports.SignalCounterSettings = SignalCounterSettings;
