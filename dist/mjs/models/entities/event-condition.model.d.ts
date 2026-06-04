import { CompressionInterval, ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class EventCondition extends ConfigurationEntity {
    Enabled: Field<boolean>;
    Settings: ConditionSettings;
    constructor();
}
export declare enum EventConditionSettingsType {
    SignalConditionSettings = "SignalConditionSettings",
    MinimumMonitoringSettings = "MinimumMonitoringSettings",
    MaximumMonitoringSettings = "MaximumMonitoringSettings",
    PeriodMaximumMonitoringSettings = "PeriodMaximumMonitoringSettings",
    ChangeRateMonitoringSettings = "ChangeRateMonitoringSettings",
    PlausibilityMonitoringSettings = "PlausibilityMonitoringSettings",
    PositionMonitoringSettings = "PositionMonitoringSettings",
    CounterConditionSettings = "CounterConditionSettings",
    TimebasedConditionSettings = "TimebasedConditionSettings",
    ConnectionFailureConditionSettings = "ConnectionFailureConditionSettings",
    DataConnectionFailure = "DataConnectionFailure",
    DifferenceMonitoringSettings = "DifferenceMonitoringSettings",
    RecordingFailureMonitoringSettings = "RecordingFailureMonitoringSettings"
}
export declare enum SignalConditionSettingsOperator {
    Equal = "Equal",
    GreaterThan = "GreaterThan",
    GreaterThanOrEqual = "GreaterThanOrEqual",
    LessThan = "LessThan",
    LessThanOrEqual = "LessThanOrEqual",
    NotEqual = "NotEqual"
}
export declare abstract class ConditionSettings {
    _t: EventConditionSettingsType;
    constructor(type: EventConditionSettingsType);
}
export declare class SignalConditionSettings extends ConditionSettings {
    InConditionOperator: Field<SignalConditionSettingsOperator>;
    OutConditionOperator: Field<SignalConditionSettingsOperator>;
    InConditionValue: Field<any>;
    OutConditionValue: Field<any>;
    InDelay: Field<number>;
    OutDelay: Field<number>;
    SignalId: Field<string>;
    constructor();
}
export declare class CounterConditionSettings extends ConditionSettings {
    SignalId: Field<string>;
    Value: Field<number>;
    StartValue: Field<number>;
    StartDate: Field<Date>;
    DelayedTriggeringEnabled: Field<boolean>;
    constructor();
}
export declare class ConnectionFailureConditionSettings extends ConditionSettings {
    MaxOfflineTime: Field<number>;
    DataSourceId: Field<string>;
    constructor();
}
export declare class DataConnectionFailureConditionSettings extends ConditionSettings {
    MaxOfflineTime: Field<number>;
    DataConnectionId: Field<string>;
    constructor();
}
export declare class TimebasedConditionSettings extends ConditionSettings {
    RRule: string;
    StartsAt: Date;
    StartTime: string;
    EndsAt: Date;
    EndTime: string;
    DelayedTriggeringEnabled: boolean;
    TriggerMissedOnAdd: boolean;
    SubsequentTriggeringEnabled: boolean;
    Timezone: string;
    constructor();
}
export declare class MinimumMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    ValueIntervalType: CompressionInterval;
    TimeZone: string;
    MinimumValue: number | boolean | string;
    MinimumFrom: string;
    MinimumTill: string;
    MinimumEvent: string;
    constructor();
}
export declare class MaximumMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    MaximumValue: number | boolean | string;
    ValueIntervalType: CompressionInterval;
    TimeZone: string;
    constructor();
}
export declare class PeriodMaximumMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    ValueIntervalType: CompressionInterval;
    TimeZone: string;
    Periods: PeriodMaximumMonitoringSettingsPeriod[];
    constructor();
}
export declare class PeriodMaximumMonitoringSettingsPeriod {
    From: string;
    Till: string;
    Value: string | number | boolean;
}
export declare class ChangeRateMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    TimeZone: string;
    ValueIntervalType: CompressionInterval;
    ValueIntervalCount: number;
    MaximumChangeRate: number | string | boolean;
    constructor();
}
export declare class PlausibilityMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    MinimumValue: number | string | boolean;
    MaximumValue: number | string | boolean;
    ValueIntervalType: CompressionInterval;
    TimeZone: string;
    constructor();
}
export declare class PositionMonitoringSettings extends ConditionSettings {
    LongitudeObjectId: string;
    LatitudeObjectId: string;
    FixedLongitude: number;
    FixedLatitude: number;
    FixedDistance: number;
    constructor();
}
export declare class RecordingFailureMonitoringSettings extends ConditionSettings {
    SignalId: Field<string>;
    MaxOutageTime: Field<number>;
    constructor();
}
export declare class DifferenceMonitoringSettings extends ConditionSettings {
    CompareObject_A: ObjectSettings;
    CompareObject_B: ObjectSettings;
    ValueIntervalType: CompressionInterval;
    MaximumDifference: number;
    MaximumTimestampDistance: number;
    constructor();
}
export declare class ObjectSettings {
    ObjectId: string;
    ObjectType: ValueObjectType;
}
