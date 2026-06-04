import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class EventCondition extends ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new Field(true);
    }
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
    constructor(type) {
        this._t = type;
    }
}
export class SignalConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.SignalConditionSettings);
        this.InConditionOperator = new Field();
        this.OutConditionOperator = new Field();
        this.InConditionValue = new Field();
        this.OutConditionValue = new Field();
        this.InDelay = new Field();
        this.OutDelay = new Field();
        this.SignalId = new Field();
    }
}
export class CounterConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.CounterConditionSettings);
        this.SignalId = new Field();
        this.Value = new Field();
        this.StartValue = new Field();
        this.StartDate = new Field();
        this.DelayedTriggeringEnabled = new Field(false);
    }
}
export class ConnectionFailureConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.ConnectionFailureConditionSettings);
        this.MaxOfflineTime = new Field();
        this.DataSourceId = new Field();
    }
}
export class DataConnectionFailureConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.DataConnectionFailure);
        this.MaxOfflineTime = new Field();
        this.DataConnectionId = new Field();
    }
}
export class TimebasedConditionSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.TimebasedConditionSettings);
        this.DelayedTriggeringEnabled = false;
        this.TriggerMissedOnAdd = false;
        this.SubsequentTriggeringEnabled = false;
    }
}
export class MinimumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.MinimumMonitoringSettings);
    }
}
export class MaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.MaximumMonitoringSettings);
    }
}
export class PeriodMaximumMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PeriodMaximumMonitoringSettings);
        this.Periods = [];
    }
}
export class PeriodMaximumMonitoringSettingsPeriod {
}
export class ChangeRateMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.ChangeRateMonitoringSettings);
    }
}
export class PlausibilityMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PlausibilityMonitoringSettings);
    }
}
export class PositionMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.PositionMonitoringSettings);
    }
}
export class RecordingFailureMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.RecordingFailureMonitoringSettings);
        this.SignalId = new Field(null);
        this.MaxOutageTime = new Field(60000);
    }
}
export class DifferenceMonitoringSettings extends ConditionSettings {
    constructor() {
        super(EventConditionSettingsType.DifferenceMonitoringSettings);
    }
}
export class ObjectSettings {
}
