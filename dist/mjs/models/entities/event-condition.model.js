import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class EventCondition extends ConfigurationEntity {
}
export var EventConditionSettingsType;
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
})(EventConditionSettingsType || (EventConditionSettingsType = {}));
export var SignalConditionSettingsOperator;
(function (SignalConditionSettingsOperator) {
    SignalConditionSettingsOperator["Equal"] = "Equal";
    SignalConditionSettingsOperator["GreaterThan"] = "GreaterThan";
    SignalConditionSettingsOperator["GreaterThanOrEqual"] = "GreaterThanOrEqual";
    SignalConditionSettingsOperator["LessThan"] = "LessThan";
    SignalConditionSettingsOperator["LessThanOrEqual"] = "LessThanOrEqual";
    SignalConditionSettingsOperator["NotEqual"] = "NotEqual";
})(SignalConditionSettingsOperator || (SignalConditionSettingsOperator = {}));
export class ConditionSettings {
}
export class SignalConditionSettings extends ConditionSettings {
}
export class CounterConditionSettings extends ConditionSettings {
}
export class ConnectionFailureConditionSettings extends ConditionSettings {
}
export class DataConnectionFailureConditionSettings extends ConditionSettings {
}
export class MinimumMonitoringSettings extends ConditionSettings {
}
export class MaximumMonitoringSettings extends ConditionSettings {
}
export class PeriodMaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super();
        this.Periods = [];
    }
}
export class PeriodMaximumMonitoringSettingsPeriod {
}
export class ChangeRateMonitoringSettings extends ConditionSettings {
}
export class PlausibilityMonitoringSettings extends ConditionSettings {
}
export class PositionMonitoringSettings extends ConditionSettings {
}
export class RecordingFailureMonitoringSettings extends ConditionSettings {
    constructor() {
        super();
        this._t = EventConditionSettingsType.RecordingFailureMonitoringSettings;
        this.SignalId = new Field(null);
        this.MaxOutageTime = new Field(60000);
    }
}
export class DifferenceMonitoringSettings extends ConditionSettings {
}
export class ObjectSettings {
}
