import { CompressionInterval, ValueObjectType } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class EventCondition extends ConfigurationEntity {
    Settings: ConditionSettings;
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
export declare class ConditionSettings {
    _t: EventConditionSettingsType;
}
export declare class SignalConditionSettings extends ConditionSettings {
    InConditionOperator: Field<SignalConditionSettingsOperator>;
    OutConditionOperator: Field<SignalConditionSettingsOperator>;
    InConditionValue: Field<string>;
    OutConditionValue: Field<string>;
    InDelay: Field<number>;
    OutDelay: Field<number>;
    SignalId: Field<string>;
}
export declare class CounterConditionSettings extends ConditionSettings {
    SignalId: Field<string>;
    Value: Field<number>;
    StartValue: Field<number>;
    StartDate: Field<Date>;
}
export declare class ConnectionFailureConditionSettings extends ConditionSettings {
    MaxOfflineTime: Field<number>;
    DataSourceId: Field<string>;
}
export declare class DataConnectionFailureConditionSettings extends ConditionSettings {
    MaxOfflineTimeout: Field<number>;
    DataConnectionId: Field<string>;
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
}
export declare class MaximumMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    MaximumValue: number | boolean | string;
    TimeZone: string;
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
}
export declare class PlausibilityMonitoringSettings extends ConditionSettings {
    ObjectType: ValueObjectType;
    ObjectId: string;
    MinimumValue: number | string | boolean;
    MaximumValue: number | string | boolean;
    ValueIntervalType: CompressionInterval;
    TimeZone: string;
}
export declare class PositionMonitoringSettings extends ConditionSettings {
    LongitudeObjectId: string;
    LatitudeObjectId: string;
    FixedLongitude: number;
    FixedLatitude: number;
    FixedDistance: number;
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
}
export declare class ObjectSettings {
    ObjectId: string;
    ObjectType: ValueObjectType;
}
