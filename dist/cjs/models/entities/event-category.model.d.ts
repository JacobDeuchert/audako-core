import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum EventCategoryClass {
    CriticalAlarm = "CriticalAlarm",
    MajorAlarm = "MajorAlarm",
    MinorAlarm = "MinorAlarm",
    WarningAlarm = "WarningAlarm",
    InformationalAlarm = "InformationalAlarm",
    IndeterminateAlarm = "IndeterminateAlarm",
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}
export declare enum AlarmTrigger {
    OnRaised = 1,
    OnDropped = 2
}
export declare class EventCategory extends ConfigurationEntity {
    Class: Field<EventCategoryClass>;
    RequiresAcknowledgment: Field<boolean>;
    NoRepeatUntilAcknowledged: Field<boolean>;
    AlarmOn: Field<AlarmTrigger>;
    constructor();
}
