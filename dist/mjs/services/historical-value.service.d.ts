import { ApiContext } from '../api/api-context.js';
import { CompressionInterval, HistoricalValueMap, MeasuredValue, MeasuredValueNote, MeasurementValueSource, ValueObjectType } from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { ValueEntityType } from '../models/widgets/shared.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
/**
 * A single historian value query (v5 `ValueQuery`, v4 `HistoricalValueRequest`).
 */
export type HistoricalValueRequest = {
    ObjectType: ValueObjectType | ValueEntityType | string;
    ObjectId: string;
    IntervalType: CompressionInterval | string;
    /**
     * @deprecated Dropped in v5. Use `MinMaxIntervalType`. When only this field is set the
     * service promotes it to `MinMaxIntervalType` on v5 and strips it from the request.
     */
    MinMaxInterval?: CompressionInterval;
    MinMaxIntervalType?: CompressionInterval | string;
    From: Date | string;
    Till: Date | string;
    Timezone: string;
    ConvertBackToUtc: boolean;
    IntervalRound?: boolean;
    WithoutOffset?: boolean;
    /** v5 only: free-form reference echoed back by the historian. Ignored on v4. */
    Reference?: string;
    /** v5 only: limits how far back the raw database is read. Ignored on v4. */
    LimitDbHours?: number;
};
export interface ManualDataRequest {
    IntervalType: CompressionInterval | string;
    Note: string;
    ObjectId: string;
    ObjectType: ValueObjectType | ValueEntityType | string;
    Timestamp: Date;
    Timezone: string;
    Value: string;
    /** v5 only: subscription prefix of the object. Ignored on v4. */
    Prefix?: string;
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
/** Note attached to a value. Alias of the canonical {@link MeasuredValueNote}. */
export type NoteEntry = MeasuredValueNote;
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
/**
 * Canonical body of {@link HistoricalValueService.setCustomOffset}, following the v5
 * `SetCounterCustomOffsetRequest`. v5 serializes PascalCase, v4 read the body camelCase; the
 * service re-cases it per version.
 */
export interface SetCounterCustomOffsetRequest {
    Timestamp: string;
    Value: number;
    Note?: string | null;
    Source: OffsetSource;
}
/**
 * @deprecated camelCase body of the v4 endpoint. Still accepted by
 * {@link HistoricalValueService.setCustomOffset} and mapped onto
 * {@link SetCounterCustomOffsetRequest}; use the PascalCase form.
 */
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
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    /**
     * Flat-row value query. v4: `POST {historian}/value/manyflat`,
     * v5: `POST {historian}/historical-values/query-many-flat`.
     */
    requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]>;
    /**
     * @deprecated Duplicate of {@link requestHistoricalValues} - same endpoint, only the declared
     * return type differs. Use `requestHistoricalValues`.
     */
    getHistoricalValues(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValue[]>;
    /**
     * Packaged value query. v4: `POST {historian}/value/many`,
     * v5: `POST {historian}/historical-values/query-many`.
     */
    getHistoricalValueObjects(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValueObject[]>;
    /**
     * Value closest to the requested timestamp.
     *
     * v5 answers with a full `MeasuredValue` (free-form `Value`, `Min*`/`Max*`, `Notes`), v4 with
     * the flat historical value. Both are normalized to {@link MeasuredValue}, so the declared
     * `Value: number` of the v4 signature is gone - check the type yourself if you need a number.
     */
    getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<MeasuredValue>;
    /**
     * @deprecated Typo alias of {@link getNearestValue}.
     */
    getNearesValue(historicalValueRequest: HistoricalValueRequest): Promise<MeasuredValue>;
    getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject>;
    postManualData(manualDataRequests: ManualDataRequest[]): Promise<void>;
    /** v4: `POST {historian}/value/note`, v5: `POST {historian}/historical-values/notes`. */
    postNoteEntries(noteEntryRequests: NoteEntryRequest[]): Promise<void>;
    getCounterOffsets(id: string, from?: Date, till?: Date): Promise<CounterOffset[]>;
    /**
     * Sets the custom offset of a counter signal.
     *
     * The body casing differs: v4 read camelCase, v5 PascalCase. Pass the canonical
     * {@link SetCounterCustomOffsetRequest}; the deprecated camelCase
     * {@link SetCustomOffsetRequest} is still accepted and converted.
     */
    setCustomOffset(id: string, request: SetCounterCustomOffsetRequest | SetCustomOffsetRequest): Promise<void>;
    deleteCounterOffsets(id: string, timestamps: string[]): Promise<void>;
    deleteCustomOffsets(id: string, timestamps: string[]): Promise<boolean>;
    resetCalculatedValuesAndStatistic(signalId: string, resetOffsets: boolean, from?: Date | null, till?: Date | null, resetCustomOffsets?: boolean): Promise<OperationStartedResponse>;
    /**
     * v4: `POST {historian}/historicalvalueimport/import`,
     * v5: `POST {historian}/historical-value-imports`.
     */
    importHistoricalValues(importData: Record<string, any>[]): Promise<OperationStartedResponse>;
    /** Applies the per-version value query mapping (drops `MinMaxInterval` on v5). */
    private toValueQueries;
}
