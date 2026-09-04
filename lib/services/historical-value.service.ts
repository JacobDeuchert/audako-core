import { ApiContext } from '../api/api-context.js';
import {
  customOffsetBodyToWire,
  measuredValueFromWire,
  measuredValuePackageFromWire,
  valueQueriesToWire,
} from '../compat/adapters/historical-value.adapter.v4.js';
import {
  CompressionInterval,
  HistoricalValueMap,
  MeasuredValue,
  MeasuredValueNote,
  MeasuredValuePackage,
  MeasurementValueSource,
  ValueObjectType,
} from '../models/historical-value.model.js';
import { HttpConfig } from '../models/http-config.model.js';
import { ValueEntityType } from '../models/widgets/shared.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';

/**
 * A single historian value query (v5 `ValueQuery`, v4 `HistoricalValueRequest`).
 */
export type HistoricalValueRequest = {
  ObjectType: ValueObjectType | ValueEntityType | string,
  ObjectId: string,

  IntervalType: CompressionInterval | string,
  /**
   * @deprecated Dropped in v5. Use `MinMaxIntervalType`. When only this field is set the
   * service promotes it to `MinMaxIntervalType` on v5 and strips it from the request.
   */
  MinMaxInterval?: CompressionInterval,
  MinMaxIntervalType?: CompressionInterval | string,

  From: Date | string,
  Till: Date | string,

  Timezone: string,
  ConvertBackToUtc: boolean,

  IntervalRound?: boolean,
  WithoutOffset?: boolean,

  /** v5 only: free-form reference echoed back by the historian. Ignored on v4. */
  Reference?: string,
  /** v5 only: limits how far back the raw database is read. Ignored on v4. */
  LimitDbHours?: number,
}

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

export class HistoricalValue {
  IntervalStart: string;
  Value?: any;
  Manual?: any;
  Note?: string;
  CreatedBy?: string;
  Notes?: NoteEntry[];
  Source?: MeasurementValueSource;
  Status?: number;

  [propName: string]: any;

  static getSignalValues(historicalValuePackage: HistoricalValue): { id: string; value: any }[] {
    const signalValues = [];

    Object.keys(historicalValuePackage).forEach((key) => {
      if (key !== 'IntervalStart' && key !== 'Manual' && key !== 'Note' && key !== 'Value') {
        signalValues.push({ id: key, value: historicalValuePackage[key] });
      }
    });

    return signalValues;
  }
}

export enum OffsetSource {
  Manual = 'Manual',
  CounterReplacement = 'CounterReplacement',
  CounterReadingAlignment = 'CounterReadingAlignment',
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

export class CounterOffset {
  Date: string;
  Value: number;
  Calculated: number | null;
  Custom: CustomOffsetView | null;
}

export class HistoricalValueObject {
  ObjectType: ValueObjectType | ValueEntityType | string;
  ObjectId: string;
  IntervalType: CompressionInterval;
  Values: HistoricalValue[];
}

/** True for the deprecated camelCase offset body. */
function isLegacyCustomOffsetRequest(
  request: SetCounterCustomOffsetRequest | SetCustomOffsetRequest,
): request is SetCustomOffsetRequest {
  return (request as SetCustomOffsetRequest)?.timestamp !== undefined;
}

export class HistoricalValueService extends BaseHttpService {
  /**
   * @param ctx Context of the target system.
   */
  constructor(ctx: ApiContext);
  /**
   * @deprecated Pass an `ApiContext` instead.
   */
  constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
  constructor(httpConfigOrCtx: ApiContext | AsyncValue<HttpConfig>, accessToken?: AsyncValue<string>) {
    super(httpConfigOrCtx as any, accessToken as any);
  }

  /**
   * Flat-row value query. v4: `POST {historian}/value/manyflat`,
   * v5: `POST {historian}/historical-values/query-many-flat`.
   */
  public async requestHistoricalValues(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]> {
    const [endpoint, body] = await Promise.all([
      this.resolve({ name: 'historicalValuesQueryManyFlat' }),
      this.toValueQueries(requests),
    ]);

    const response = await this.ctx.http.post<HistoricalValueMap[]>(endpoint.url, body);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data;
  }

  /**
   * @deprecated Duplicate of {@link requestHistoricalValues} - same endpoint, only the declared
   * return type differs. Use `requestHistoricalValues`.
   */
  public async getHistoricalValues(historicalValueRequest: HistoricalValueRequest[]): Promise<HistoricalValue[]> {
    const rows = await this.requestHistoricalValues(historicalValueRequest);
    return rows as unknown as HistoricalValue[];
  }

  /**
   * Packaged value query. v4: `POST {historian}/value/many`,
   * v5: `POST {historian}/historical-values/query-many`.
   */
  public async getHistoricalValueObjects(
    historicalValueRequest: HistoricalValueRequest[],
  ): Promise<HistoricalValueObject[]> {
    const [endpoint, body, versionInfo] = await Promise.all([
      this.resolve({ name: 'historicalValuesQueryMany' }),
      this.toValueQueries(historicalValueRequest),
      this.getVersionInfo(),
    ]);

    const response = await this.ctx.http.post<MeasuredValuePackage[]>(endpoint.url, body);
    const packages = Array.isArray(response.data) ? response.data : [];
    return packages.map(
      (valuePackage) => measuredValuePackageFromWire(valuePackage, versionInfo) as unknown as HistoricalValueObject,
    );
  }

  /**
   * Value closest to the requested timestamp.
   *
   * v5 answers with a full `MeasuredValue` (free-form `Value`, `Min*`/`Max*`, `Notes`), v4 with
   * the flat historical value. Both are normalized to {@link MeasuredValue}, so the declared
   * `Value: number` of the v4 signature is gone - check the type yourself if you need a number.
   */
  public async getNearestValue(historicalValueRequest: HistoricalValueRequest): Promise<MeasuredValue> {
    const [endpoint, versionInfo] = await Promise.all([
      this.resolve({ name: 'historicalValuesNearest' }),
      this.getVersionInfo(),
    ]);

    const response = await this.ctx.http.post<MeasuredValue>(
      endpoint.url,
      valueQueriesToWire([historicalValueRequest], versionInfo)[0],
    );
    return measuredValueFromWire(response.data, versionInfo);
  }

  /**
   * @deprecated Typo alias of {@link getNearestValue}.
   */
  public async getNearesValue(historicalValueRequest: HistoricalValueRequest): Promise<MeasuredValue> {
    return this.getNearestValue(historicalValueRequest);
  }

  public async getNthHistoricalValue(request: NthHistoricalRequest): Promise<HistoricalValueObject> {
    const [endpoint, versionInfo] = await Promise.all([
      this.resolve({ name: 'historicalValuesNth' }),
      this.getVersionInfo(),
    ]);

    const response = await this.ctx.http.post<MeasuredValuePackage>(endpoint.url, request);
    return measuredValuePackageFromWire(response.data, versionInfo) as unknown as HistoricalValueObject;
  }

  public async postManualData(manualDataRequests: ManualDataRequest[]): Promise<void> {
    const endpoint = await this.resolve({ name: 'historicalValuesManual' });
    await this.ctx.http.post<void>(endpoint.url, manualDataRequests);
  }

  /** v4: `POST {historian}/value/note`, v5: `POST {historian}/historical-values/notes`. */
  public async postNoteEntries(noteEntryRequests: NoteEntryRequest[]): Promise<void> {
    const endpoint = await this.resolve({ name: 'historicalValuesNotes' });
    await this.ctx.http.post<void>(endpoint.url, noteEntryRequests);
  }

  public async getCounterOffsets(id: string, from?: Date, till?: Date): Promise<CounterOffset[]> {
    const endpoint = await this.resolve({ name: 'counterOffsets', signalId: id });

    const params: string[] = [];
    if (from) {
      params.push(`$from=${from.toISOString()}`);
    }
    if (till) {
      params.push(`$till=${till.toISOString()}`);
    }
    const url = params.length > 0 ? `${endpoint.url}?${params.join('&')}` : endpoint.url;

    const response = await this.ctx.http.get<{ [date: string]: OffsetView }>(url);
    const offsets = response.data || {};
    return Object.keys(offsets).map((key) => ({
      Date: key,
      Value: offsets[key].Effective,
      Calculated: offsets[key].Calculated,
      Custom: offsets[key].Custom,
    }));
  }

  /**
   * Sets the custom offset of a counter signal.
   *
   * The body casing differs: v4 read camelCase, v5 PascalCase. Pass the canonical
   * {@link SetCounterCustomOffsetRequest}; the deprecated camelCase
   * {@link SetCustomOffsetRequest} is still accepted and converted.
   */
  public async setCustomOffset(
    id: string,
    request: SetCounterCustomOffsetRequest | SetCustomOffsetRequest,
  ): Promise<void> {
    const [endpoint, versionInfo] = await Promise.all([
      this.resolve({ name: 'counterOffsetsCustom', signalId: id }),
      this.getVersionInfo(),
    ]);

    const canonical: SetCounterCustomOffsetRequest = isLegacyCustomOffsetRequest(request)
      ? {
          Timestamp: request.timestamp,
          Value: request.value,
          Note: request.note,
          Source: request.source,
        }
      : request;

    await this.ctx.http.post<void>(endpoint.url, customOffsetBodyToWire(canonical, versionInfo));
  }

  public async deleteCounterOffsets(id: string, timestamps: string[]): Promise<void> {
    const endpoint = await this.resolve({ name: 'counterOffsetsRemove', signalId: id });
    await this.ctx.http.post<void>(endpoint.url, timestamps);
  }

  public async deleteCustomOffsets(id: string, timestamps: string[]): Promise<boolean> {
    const endpoint = await this.resolve({ name: 'counterOffsetsCustomRemove', signalId: id });
    const response = await this.ctx.http.post<boolean>(endpoint.url, timestamps);
    return response.data;
  }

  public async resetCalculatedValuesAndStatistic(
    signalId: string,
    resetOffsets: boolean,
    from: Date | null = null,
    till: Date | null = null,
    resetCustomOffsets: boolean = false,
  ): Promise<OperationStartedResponse> {
    const endpoint = await this.resolve({ name: 'statisticsReset', signalId: signalId });
    const response = await this.ctx.http.post<OperationStartedResponse>(endpoint.url, {
      From: from ? from.toISOString() : null,
      Till: till ? till.toISOString() : null,
      ResetOffsets: resetOffsets,
      ResetCustomOffsets: resetCustomOffsets,
    });
    return response.data;
  }

  /**
   * v4: `POST {historian}/historicalvalueimport/import`,
   * v5: `POST {historian}/historical-value-imports`.
   */
  public async importHistoricalValues(importData: Record<string, any>[]): Promise<OperationStartedResponse> {
    const endpoint = await this.resolve({ name: 'historicalValueImport' });
    const response = await this.ctx.http.post<OperationStartedResponse>(endpoint.url, { Values: importData });
    return response.data;
  }

  /** Applies the per-version value query mapping (drops `MinMaxInterval` on v5). */
  private async toValueQueries(requests: HistoricalValueRequest[]): Promise<any[]> {
    const versionInfo = await this.getVersionInfo();
    return valueQueriesToWire(requests, versionInfo);
  }
}
