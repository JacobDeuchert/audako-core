import { ConfigurationEntity } from './configuration-entity.model';
export var SignalType;
(function (SignalType) {
    SignalType["AnalogInput"] = "AnalogInput";
    SignalType["AnalogInOut"] = "AnalogInOut";
    SignalType["DigitalInput"] = "DigitalInput";
    SignalType["DigitalInOut"] = "DigitalInOut";
    SignalType["Counter"] = "Counter";
    SignalType["UniversalInput"] = "UniservalInput";
    SignalType["UniversalInOut"] = "UniversalInOut";
})(SignalType || (SignalType = {}));
export class Signal extends ConfigurationEntity {
}
export class SignalSettings {
}
export class SignalDigitalSettings extends SignalSettings {
}
export class SignalAnalogSettings extends SignalSettings {
}
export class SignalCounterSettings extends SignalSettings {
}
