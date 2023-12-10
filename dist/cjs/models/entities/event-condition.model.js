"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSettings = exports.DifferenceMonitoringSettings = exports.RecordingFailureMonitoringSettings = exports.PositionMonitoringSettings = exports.PlausibilityMonitoringSettings = exports.ChangeRateMonitoringSettings = exports.PeriodMaximumMonitoringSettingsPeriod = exports.PeriodMaximumMonitoringSettings = exports.MaximumMonitoringSettings = exports.MinimumMonitoringSettings = exports.DataConnectionFailureConditionSettings = exports.ConnectionFailureConditionSettings = exports.CounterConditionSettings = exports.SignalConditionSettings = exports.ConditionSettings = exports.SignalConditionSettingsOperator = exports.EventConditionSettingsType = exports.EventCondition = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class EventCondition extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.EventCondition = EventCondition;
var EventConditionSettingsType;
(function (EventConditionSettingsType) {
    EventConditionSettingsType["SignalConditionSettings"] = "SignalConditionSettings";
    EventConditionSettingsType["MinimumMonitoringSettings"] = "MinimumMonitoringSettings";
    EventConditionSettingsType["MaximumMonitoringSettings"] = "MaximumMonitoringSettings";
    EventConditionSettingsType["PeriodMaximumMonitoringSettings"] = "PeriodMaximumMonitoringSettings";
    EventConditionSettingsType["ChangeRateMonitoringSettings"] = "ChangeRateMonitoringSettings";
    EventConditionSettingsType["PlausibilityMonitoringSettings"] = "PlausibilityMonitoringSettings";
    EventConditionSettingsType["PositionMonitoringSettings"] = "PositionMonitoringSettings";
    EventConditionSettingsType["CounterConditionSettings"] = "CounterConditionSettings";
    EventConditionSettingsType["TimebasedConditionSettings"] = "TimebasedConditionSettings";
    EventConditionSettingsType["ConnectionFailureConditionSettings"] = "ConnectionFailureConditionSettings";
    EventConditionSettingsType["DataConnectionFailure"] = "DataConnectionFailure";
    EventConditionSettingsType["DifferenceMonitoringSettings"] = "DifferenceMonitoringSettings";
    EventConditionSettingsType["RecordingFailureMonitoringSettings"] = "RecordingFailureMonitoringSettings";
})(EventConditionSettingsType || (exports.EventConditionSettingsType = EventConditionSettingsType = {}));
var SignalConditionSettingsOperator;
(function (SignalConditionSettingsOperator) {
    SignalConditionSettingsOperator["Equal"] = "Equal";
    SignalConditionSettingsOperator["GreaterThan"] = "GreaterThan";
    SignalConditionSettingsOperator["GreaterThanOrEqual"] = "GreaterThanOrEqual";
    SignalConditionSettingsOperator["LessThan"] = "LessThan";
    SignalConditionSettingsOperator["LessThanOrEqual"] = "LessThanOrEqual";
    SignalConditionSettingsOperator["NotEqual"] = "NotEqual";
})(SignalConditionSettingsOperator || (exports.SignalConditionSettingsOperator = SignalConditionSettingsOperator = {}));
class ConditionSettings {
}
exports.ConditionSettings = ConditionSettings;
class SignalConditionSettings extends ConditionSettings {
}
exports.SignalConditionSettings = SignalConditionSettings;
class CounterConditionSettings extends ConditionSettings {
}
exports.CounterConditionSettings = CounterConditionSettings;
class ConnectionFailureConditionSettings extends ConditionSettings {
}
exports.ConnectionFailureConditionSettings = ConnectionFailureConditionSettings;
class DataConnectionFailureConditionSettings extends ConditionSettings {
}
exports.DataConnectionFailureConditionSettings = DataConnectionFailureConditionSettings;
class MinimumMonitoringSettings extends ConditionSettings {
}
exports.MinimumMonitoringSettings = MinimumMonitoringSettings;
class MaximumMonitoringSettings extends ConditionSettings {
}
exports.MaximumMonitoringSettings = MaximumMonitoringSettings;
class PeriodMaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super();
        this.Periods = [];
    }
}
exports.PeriodMaximumMonitoringSettings = PeriodMaximumMonitoringSettings;
class PeriodMaximumMonitoringSettingsPeriod {
}
exports.PeriodMaximumMonitoringSettingsPeriod = PeriodMaximumMonitoringSettingsPeriod;
class ChangeRateMonitoringSettings extends ConditionSettings {
}
exports.ChangeRateMonitoringSettings = ChangeRateMonitoringSettings;
class PlausibilityMonitoringSettings extends ConditionSettings {
}
exports.PlausibilityMonitoringSettings = PlausibilityMonitoringSettings;
class PositionMonitoringSettings extends ConditionSettings {
}
exports.PositionMonitoringSettings = PositionMonitoringSettings;
class RecordingFailureMonitoringSettings extends ConditionSettings {
    constructor() {
        super();
        this._t = EventConditionSettingsType.RecordingFailureMonitoringSettings;
        this.SignalId = new configuration_entity_model_js_1.Field(null);
        this.MaxOutageTime = new configuration_entity_model_js_1.Field(60000);
    }
}
exports.RecordingFailureMonitoringSettings = RecordingFailureMonitoringSettings;
class DifferenceMonitoringSettings extends ConditionSettings {
}
exports.DifferenceMonitoringSettings = DifferenceMonitoringSettings;
class ObjectSettings {
}
exports.ObjectSettings = ObjectSettings;
