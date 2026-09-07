import { ApiContext } from '../api/api-context.js';
import {
  customOffsetBodyToWire,
  measuredValueFromWire,
  measuredValuePackageFromWire,
} from '../compat/adapters/historical-value.adapter.v4.js';
import {
  CompressionInterval,
  HistoricalValueMap,
  MeasuredValue,
  MeasuredValueNote,
  MeasuredValuePackage,
  ValueObjectType,
} from '../models/historical-value.model.js';
import { ValueEntityType } from '../models/widgets/shared.js';

/**
 * A single historian value query (v5 `ValueQuery`, v4 `HistoricalValueRequest`).
 */
export type HistoricalValueRequest = {
  ObjectType: ValueObjectType | ValueEntityType | string;
  ObjectId: string;

  IntervalType: CompressionInterval | string;
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

export interface CounterOffset {
  Date: string;
  Value: number;
  Calculated: number | null;
  Custom: CustomOffsetView | null;
}

/** Options of {@link HistoricalValueService.resetStatistics}. Everything is optional. */
export interface ResetStatisticsOptions {
  /** Start of the range to recompute; the whole history when omitted. */
  from?: Date | null;
  /** End of the range to recompute; open-ended when omitted. */
  till?: Date | null;
  /** Also recompute the calculated counter offsets. */
  resetOffsets?: boolean;
  /** Also drop the manually set custom offsets. */
  resetCustomOffsets?: boolean;
}

/**
 * Historian value reads and writes. Method names follow one scheme: `query*` for value queries,
 * `get*` for single reads, `add*` for appends, `set*`/`delete*` for offsets, plus `resetStatistics`
 * and `importValues`. Failures surface as `ApiError`.
 */
export class HistoricalValueService {
  constructor(public readonly ctx: ApiContext) {}

  /**
   * Flat-row value query: one row per interval with signal ids as keys.
   * v4: `POST {historian}/value/manyflat`, v5: `POST {historian}/historical-values/query-many-flat`.
   */
  public async queryValuesFlat(requests: HistoricalValueRequest[]): Promise<HistoricalValueMap[]> {
    const response = await this.ctx.request<HistoricalValueMap[]>(
      { name: 'historicalValuesQueryManyFlat' },
      { data: requests },
    );
    return response.data;
  }

  /**
   * Packaged value query: one {@link MeasuredValuePackage} per request.
   * v4: `POST {historian}/value/many`, v5: `POST {historian}/historical-values/query-many`.
   */
  public async queryValues(requests: HistoricalValueRequest[]): Promise<MeasuredValuePackage[]> {
    const [response, versionInfo] = await Promise.all([
      this.ctx.request<MeasuredValuePackage[]>({ name: 'historicalValuesQueryMany' }, { data: requests }),
      this.ctx.getVersionInfo(),
    ]);

    const packages = Array.isArray(response.data) ? response.data : [];
    return packages.map((valuePackage) => measuredValuePackageFromWire(valuePackage, versionInfo));
  }

  /**
   * Value closest to the requested timestamp.
   *
   * v5 answers with a full `MeasuredValue` (free-form `Value`, `Min*`/`Max*`, `Notes`), v4 with
   * the flat historical value. Both are normalized to {@link MeasuredValue}; check the type of
   * `Value` yourself if you need a number.
   */
  public async getNearestValue(request: HistoricalValueRequest): Promise<MeasuredValue> {
    const [response, versionInfo] = await Promise.all([
      this.ctx.request<MeasuredValue>({ name: 'historicalValuesNearest' }, { data: request }),
      this.ctx.getVersionInfo(),
    ]);
    return measuredValueFromWire(response.data, versionInfo);
  }

  /** The `Count` values before the requested timestamp, as one package. */
  public async getNthValue(request: NthHistoricalRequest): Promise<MeasuredValuePackage> {
    const [response, versionInfo] = await Promise.all([
      this.ctx.request<MeasuredValuePackage>({ name: 'historicalValuesNth' }, { data: request }),
      this.ctx.getVersionInfo(),
    ]);
    return measuredValuePackageFromWire(response.data, versionInfo);
  }

  public async addManualValues(requests: ManualDataRequest[]): Promise<void> {
    await this.ctx.request<void>({ name: 'historicalValuesManual' }, { data: requests });
  }

  /** v4: `POST {historian}/value/note`, v5: `POST {historian}/historical-values/notes`. */
  public async addNotes(requests: NoteEntryRequest[]): Promise<void> {
    await this.ctx.request<void>({ name: 'historicalValuesNotes' }, { data: requests });
  }

  public async getCounterOffsets(signalId: string, from?: Date, till?: Date): Promise<CounterOffset[]> {
    const response = await this.ctx.request<{ [date: string]: OffsetView }>(
      { name: 'counterOffsets', signalId: signalId },
      { params: { $from: from?.toISOString(), $till: till?.toISOString() } },
    );

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
   * The body casing differs: v4 read camelCase, v5 PascalCase. Pass the canonical PascalCase
   * {@link SetCounterCustomOffsetRequest}; the v4 adapter re-cases it for the v4 wire.
   */
  public async setCustomOffset(signalId: string, request: SetCounterCustomOffsetRequest): Promise<void> {
    const versionInfo = await this.ctx.getVersionInfo();
    await this.ctx.request<void>(
      { name: 'counterOffsetsCustom', signalId: signalId },
      { data: customOffsetBodyToWire(request, versionInfo) },
    );
  }

  public async deleteCounterOffsets(signalId: string, timestamps: string[]): Promise<void> {
    await this.ctx.request<void>({ name: 'counterOffsetsRemove', signalId: signalId }, { data: timestamps });
  }

  public async deleteCustomOffsets(signalId: string, timestamps: string[]): Promise<boolean> {
    const response = await this.ctx.request<boolean>(
      { name: 'counterOffsetsCustomRemove', signalId: signalId },
      { data: timestamps },
    );
    return response.data;
  }

  /** Recomputes the calculated values and statistics of a signal. Returns the started operation. */
  public async resetStatistics(
    signalId: string,
    options: ResetStatisticsOptions = {},
  ): Promise<OperationStartedResponse> {
    const response = await this.ctx.request<OperationStartedResponse>(
      { name: 'statisticsReset', signalId: signalId },
      {
        data: {
          From: options.from ? options.from.toISOString() : null,
          Till: options.till ? options.till.toISOString() : null,
          ResetOffsets: !!options.resetOffsets,
          ResetCustomOffsets: !!options.resetCustomOffsets,
        },
      },
    );
    return response.data;
  }

  /**
   * v4: `POST {historian}/historicalvalueimport/import`,
   * v5: `POST {historian}/historical-value-imports`.
   */
  public async importValues(values: Record<string, any>[]): Promise<OperationStartedResponse> {
    const response = await this.ctx.request<OperationStartedResponse>(
      { name: 'historicalValueImport' },
      { data: { Values: values } },
    );
    return response.data;
  }
}
