import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var EventCategoryClass;
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
})(EventCategoryClass || (EventCategoryClass = {}));
export var AlarmTrigger;
(function (AlarmTrigger) {
    AlarmTrigger[AlarmTrigger["OnRaised"] = 1] = "OnRaised";
    AlarmTrigger[AlarmTrigger["OnDropped"] = 2] = "OnDropped";
})(AlarmTrigger || (AlarmTrigger = {}));
export class EventCategory extends ConfigurationEntity {
    constructor() {
        super();
        this.Class = new Field(EventCategoryClass.Info);
        this.RequiresAcknowledgment = new Field(true);
        this.NoRepeatUntilAcknowledged = new Field(false);
        this.AlarmOn = new Field(AlarmTrigger.OnRaised);
    }
}
