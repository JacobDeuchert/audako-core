import { CompressionInterval, HistoricalValueMap, MeasurementValueSource, ValueObjectType } from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { ValueEntityType } from '../models/widgets/shared.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export type HistoricalValueRequest = {
    ObjectType: ValueObjectType | ValueEntityType | string;
    ObjectId: string;
    IntervalType: CompressionInterval | string;
    MinMaxInterval?: CompressionInterval;
    MinMaxIntervalType?: CompressionInterval | string;
    From: Date | string;
    Till: Date | string;
    Timezone: string;
    ConvertBackToUtc: boolean;
    IntervalRound?: boolean;
    WithoutOffset?: boolean;
};
export interface ManualDataRequest {
    IntervalType: CompressionInterval | string;
    Note: string;
    ObjectId: string;
    ObjectType: ValueObjectType | ValueEntityType | string;
    Timestamp: Date;
    Timezone: string;
    Value: string;
}
export interface NoteEntryRequest {
    IntervalType: CompressionInterval | string;
    Note: string;
    ObjectId: string;
    Timestamp: Date;
    Timezone: string;
}
export interface NthHistoricalRequest {
    Count: number;
    ObjectType: ValueObjectType | ValueEntityType;
    ObjectId: string;
    IntervalType: CompressionInterval;
    Timestamp: Date;
    Timezone: string;
}
export type NoteEntry = {
    Note: string;
    CreatedBy: string;
    Timestamp: string;
};
export type OperationStartedResponse = {
    OperationId: string;
};
export declare class HistoricalValue {
    IntervalStart: string;
    Value?: any;
    Manual?: any;
    Note?: string;
    CreatedBy?: string;
    Notes?: NoteEntry[];
    Source?: MeasurementValueSource;
    Status?: number;
    [propName: string]: any;
    static getSignalValues(historicalValuePackage: HistoricalValue): {
        id: string;
        value: any;
    }[];
}
export declare enum OffsetSource {
    Manual = "Manual",
    CounterReplacement = "CounterReplacement",
    CounterReadingAlignment = "CounterReadingAlignment"
}
export interface CustomOffsetView {
    Value: number;
    Source: OffsetSource;
    Author: string;
    Note: string | null;
    Created: string;
    Updated: string;
}
export interface OffsetView {
    Calculated: number | null;
    Custom: CustomOffsetView | null;
    Effective: number;
}
export interface SetCustomOffsetRequest {
    timestamp: string;
    value: number;
    note?: string | null;
    source: OffsetSource;
}
export declare class CounterOffset {
    Date: string;
    Value: number;
    Calculated: number | null;
    Custom: CustomOffsetView | null;
}
export declare class HistoricalValueObject {
    ObjectType: ValueObjectType | ValueEntityType | string;
    ObjectId: string;
    IntervalType: CompressionInterval;
    Values: HistoricalValue[];
}
export declare class HistoricalValueService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]>;
    getHistoricalValues(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValue[]>;
    getHistoricalValueObjects(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValueObject[]>;
    getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {
        Value: number;
    }>;
    getNearesValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {
        Value: number;
    }>;
    getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject>;
    postManualData(manualDataRequests: ManualDataRequest[]): Promise<void>;
    postNoteEntries(noteEntryRequests: NoteEntryRequest[]): Promise<void>;
    getCounterOffsets(id: string, from?: Date, till?: Date): Promise<CounterOffset[]>;
    setCustomOffset(id: string, request: SetCustomOffsetRequest): Promise<void>;
    deleteCounterOffsets(id: string, timestamps: string[]): Promise<void>;
    deleteCustomOffsets(id: string, timestamps: string[]): Promise<boolean>;
    resetCalculatedValuesAndStatistic(signalId: string, resetOffsets: boolean, from?: Date | null, till?: Date | null, resetCustomOffsets?: boolean): Promise<OperationStartedResponse>;
    importHistoricalValues(importData: Record<string, any>[]): Promise<OperationStartedResponse>;
    private getHistorianUrl;
}
