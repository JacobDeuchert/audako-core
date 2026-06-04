"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategory = exports.AlarmTrigger = exports.EventCategoryClass = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var EventCategoryClass;
(function (EventCategoryClass) {
    EventCategoryClass["CriticalAlarm"] = "CriticalAlarm";
    EventCategoryClass["MajorAlarm"] = "MajorAlarm";
    EventCategoryClass["MinorAlarm"] = "MinorAlarm";
    EventCategoryClass["WarningAlarm"] = "WarningAlarm";
    EventCategoryClass["InformationalAlarm"] = "InformationalAlarm";
    EventCategoryClass["IndeterminateAlarm"] = "IndeterminateAlarm";
    EventCategoryClass["Info"] = "Info";
    EventCategoryClass["Warning"] = "Warning";
    EventCategoryClass["Error"] = "Error";
})(EventCategoryClass || (exports.EventCategoryClass = EventCategoryClass = {}));
var AlarmTrigger;
(function (AlarmTrigger) {
    AlarmTrigger[AlarmTrigger["OnRaised"] = 1] = "OnRaised";
    AlarmTrigger[AlarmTrigger["OnDropped"] = 2] = "OnDropped";
})(AlarmTrigger || (exports.AlarmTrigger = AlarmTrigger = {}));
class EventCategory extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Class = new configuration_entity_model_js_1.Field(EventCategoryClass.Info);
        this.RequiresAcknowledgment = new configuration_entity_model_js_1.Field(true);
        this.NoRepeatUntilAcknowledged = new configuration_entity_model_js_1.Field(false);
        this.AlarmOn = new configuration_entity_model_js_1.Field(AlarmTrigger.OnRaised);
    }
}
exports.EventCategory = EventCategory;
