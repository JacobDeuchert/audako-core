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
    /**
     * v5 only (>= 5.0, feature `acknowledgmentField`), and **not** the v4 `Acknowledgment` field:
     * up to 4.22 that wire key was the old name of {@link RequiresAcknowledgment} (renamed in 4.23,
     * without a server migrator), while v5 re-added `Acknowledgment` next to it with a different
     * meaning. Undefined on v4, where the v4 adapter strips it from writes.
     */
    Acknowledgment?: Field<boolean>;
    NoRepeatUntilAcknowledged: Field<boolean>;
    AlarmOn: Field<AlarmTrigger>;
    constructor();
}
