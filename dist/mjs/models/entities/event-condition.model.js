import { ConfigurationEntity } from './configuration-entity.model.js';
export class EventCondition extends ConfigurationEntity {
}
export var EventConditionSettingsType;
(function (EventConditionSettingsType) {
    EventConditionSettingsType["SignalConditionSettings"] = "SignalConditionSettings";
    EventConditionSettingsType["DataConnectionFailureConditionSettings"] = "DataConnectionFailureConditionSettings";
})(EventConditionSettingsType || (EventConditionSettingsType = {}));
export class ConditionSettings {
}
export class SignalConditionSettings extends ConditionSettings {
}
export class DataConnectionFailureConditionSettings extends ConditionSettings {
}
