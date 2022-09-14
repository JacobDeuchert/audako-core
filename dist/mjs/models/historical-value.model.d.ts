import { EntityType } from './entities/configuration-entity.model.js';
export declare enum CompressionInterval {
    ProcessInterval = "ProcessInterval",
    SubInterval = "SubInterval",
    HourInterval = "HourInterval",
    TwoHourInterval = "TwoHourInterval",
    DayInterval = "DayInterval",
    WeekInterval = "WeekInterval",
    MonthInterval = "MonthInterval",
    QuarterInterval = "QuarterInterval",
    YearInterval = "YearInterval"
}
export declare type ValueObjectType = EntityType.Signal | EntityType.Formula;
export declare type HistoricalValueMap = {
    IntervalStart: string;
} & {
    [signalId: string]: number | string | boolean;
};
