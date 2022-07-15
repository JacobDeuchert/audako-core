"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataConnectionFailureConditionSettings = exports.SignalConditionSettings = exports.ConditionSettings = exports.EventConditionSettingsType = exports.EventCondition = void 0;
const configuration_entity_model_1 = require("./configuration-entity.model");
class EventCondition extends configuration_entity_model_1.ConfigurationEntity {
}
exports.EventCondition = EventCondition;
var EventConditionSettingsType;
(function (EventConditionSettingsType) {
    EventConditionSettingsType["SignalConditionSettings"] = "SignalConditionSettings";
    EventConditionSettingsType["DataConnectionFailureConditionSettings"] = "DataConnectionFailureConditionSettings";
})(EventConditionSettingsType = exports.EventConditionSettingsType || (exports.EventConditionSettingsType = {}));
class ConditionSettings {
}
exports.ConditionSettings = ConditionSettings;
class SignalConditionSettings extends ConditionSettings {
}
exports.SignalConditionSettings = SignalConditionSettings;
class DataConnectionFailureConditionSettings extends ConditionSettings {
}
exports.DataConnectionFailureConditionSettings = DataConnectionFailureConditionSettings;
