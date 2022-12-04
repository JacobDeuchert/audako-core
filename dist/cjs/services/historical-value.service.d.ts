import { CompressionInterval, HistoricalValueMap, ValueObjectType } from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export type HistoricalValueRequest = {
    ObjectType: ValueObjectType;
    ObjectId: string;
    IntervalType: CompressionInterval;
    MinMaxInterval?: CompressionInterval;
    From: Date | string;
    Till: Date | string;
    Timezone: string;
    ConvertBackToUtc: boolean;
    IntervalRound?: boolean;
    WithoutOffset?: boolean;
};
export interface ManualDataRequest {
    IntervalType: CompressionInterval;
    Note: string;
    ObjectId: string;
    ObjectType: ValueObjectType;
    Timestamp: Date;
    Timezone: string;
    Value: string;
}
export interface NthHistoricalRequest {
    Count: number;
    ObjectType: ValueObjectType;
    ObjectId: string;
    IntervalType: CompressionInterval;
    Timestamp: Date;
    Timezone: string;
}
export declare class HistoricalValue {
    IntervalStart: string;
    Value?: any;
    Manual?: any;
    Note?: string;
    [propName: string]: any;
}
export declare class CounterOffset {
    Date: string;
    Value: number;
}
export declare class HistoricalValueObject {
    ObjectType: ValueObjectType;
    ObjectId: string;
    IntervalType: CompressionInterval;
    Values: HistoricalValue[];
}
export declare class HistoricalValueService extends BaseHttpService {
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]>;
    getHistoricalValueObjects(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValueObject[]>;
    getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<HistoricalValue & {
        Value: number;
    }>;
    getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject>;
    private getHistorianUrl;
}
