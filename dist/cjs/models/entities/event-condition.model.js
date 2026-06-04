"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSettings = exports.DifferenceMonitoringSettings = exports.RecordingFailureMonitoringSettings = exports.PositionMonitoringSettings = exports.PlausibilityMonitoringSettings = exports.ChangeRateMonitoringSettings = exports.PeriodMaximumMonitoringSettingsPeriod = exports.PeriodMaximumMonitoringSettings = exports.MaximumMonitoringSettings = exports.MinimumMonitoringSettings = exports.TimebasedConditionSettings = exports.DataConnectionFailureConditionSettings = exports.ConnectionFailureConditionSettings = exports.CounterConditionSettings = exports.SignalConditionSettings = exports.ConditionSettings = exports.SignalConditionSettingsOperator = exports.EventConditionSettingsType = exports.EventCondition = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class EventCondition extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new configuration_entity_model_js_1.Field(true);
    }
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
    constructor(type) {
        this._t = type;
    }
}
exports.ConditionSettings = ConditionSettings;
class SignalConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.SignalConditionSettings);
        this.InConditionOperator = new configuration_entity_model_js_1.Field();
        this.OutConditionOperator = new configuration_entity_model_js_1.Field();
        this.InConditionValue = new configuration_entity_model_js_1.Field();
        this.OutConditionValue = new configuration_entity_model_js_1.Field();
        this.InDelay = new configuration_entity_model_js_1.Field();
        this.OutDelay = new configuration_entity_model_js_1.Field();
        this.SignalId = new configuration_entity_model_js_1.Field();
    }
}
exports.SignalConditionSettings = SignalConditionSettings;
class CounterConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.CounterConditionSettings);
        this.SignalId = new configuration_entity_model_js_1.Field();
        this.Value = new configuration_entity_model_js_1.Field();
        this.StartValue = new configuration_entity_model_js_1.Field();
        this.StartDate = new configuration_entity_model_js_1.Field();
        this.DelayedTriggeringEnabled = new configuration_entity_model_js_1.Field(false);
    }
}
exports.CounterConditionSettings = CounterConditionSettings;
class ConnectionFailureConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.ConnectionFailureConditionSettings);
        this.MaxOfflineTime = new configuration_entity_model_js_1.Field();
        this.DataSourceId = new configuration_entity_model_js_1.Field();
    }
}
exports.ConnectionFailureConditionSettings = ConnectionFailureConditionSettings;
class DataConnectionFailureConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.DataConnectionFailure);
        this.MaxOfflineTime = new configuration_entity_model_js_1.Field();
        this.DataConnectionId = new configuration_entity_model_js_1.Field();
    }
}
exports.DataConnectionFailureConditionSettings = DataConnectionFailureConditionSettings;
class TimebasedConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.TimebasedConditionSettings);
        this.DelayedTriggeringEnabled = false;
        this.TriggerMissedOnAdd = false;
        this.SubsequentTriggeringEnabled = false;
    }
}
exports.TimebasedConditionSettings = TimebasedConditionSettings;
class MinimumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.MinimumMonitoringSettings);
    }
}
exports.MinimumMonitoringSettings = MinimumMonitoringSettings;
class MaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.MaximumMonitoringSettings);
    }
}
exports.MaximumMonitoringSettings = MaximumMonitoringSettings;
class PeriodMaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PeriodMaximumMonitoringSettings);
        this.Periods = [];
    }
}
exports.PeriodMaximumMonitoringSettings = PeriodMaximumMonitoringSettings;
class PeriodMaximumMonitoringSettingsPeriod {
}
exports.PeriodMaximumMonitoringSettingsPeriod = PeriodMaximumMonitoringSettingsPeriod;
class ChangeRateMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.ChangeRateMonitoringSettings);
    }
}
exports.ChangeRateMonitoringSettings = ChangeRateMonitoringSettings;
class PlausibilityMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PlausibilityMonitoringSettings);
    }
}
exports.PlausibilityMonitoringSettings = PlausibilityMonitoringSettings;
class PositionMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PositionMonitoringSettings);
    }
}
exports.PositionMonitoringSettings = PositionMonitoringSettings;
class RecordingFailureMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.RecordingFailureMonitoringSettings);
        this.SignalId = new configuration_entity_model_js_1.Field(null);
        this.MaxOutageTime = new configuration_entity_model_js_1.Field(60000);
    }
}
exports.RecordingFailureMonitoringSettings = RecordingFailureMonitoringSettings;
class DifferenceMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.DifferenceMonitoringSettings);
    }
}
exports.DifferenceMonitoringSettings = DifferenceMonitoringSettings;
class ObjectSettings {
}
exports.ObjectSettings = ObjectSettings;
