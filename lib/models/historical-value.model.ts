import { EntityType } from './entities/configuration-entity.model.js';

export enum CompressionInterval {
  ProcessInterval = 'ProcessInterval',
  SubInterval = 'SubInterval',
  HourInterval = 'HourInterval',
  TwoHourInterval = 'TwoHourInterval',
  DayInterval = 'DayInterval',
  WeekInterval = 'WeekInterval',
  MonthInterval = 'MonthInterval',
  QuarterInterval = 'QuarterInterval',
  YearInterval = 'YearInterval',
}

export enum MeasurementValueSource {
  System = 'System',
  Process = 'Process',
  Import = 'Import',
  Manual = 'Manual',
  Mixed = 'Mixed',
  Manipulated = 'Manipulated',
}

export type ValueObjectType = EntityType.Signal | EntityType.Formula;

/** One flat query row: the interval start plus one value per signal id. */
export type HistoricalValueMap = { IntervalStart: string } & { [signalId: string]: number | string | boolean };

/** Splits a flat query row into `{id, value}` pairs, dropping the interval and note bookkeeping keys. */
export function getSignalValues(row: HistoricalValueMap): { id: string; value: any }[] {
  const reserved = ['IntervalStart', 'Manual', 'Note', 'Value'];
  return Object.keys(row || {})
    .filter((key) => !reserved.includes(key))
    .map((key) => ({ id: key, value: (row as any)[key] }));
}

/**
 * One note attached to a measured value. Identical on both platform lines
 * (v5 `MeasuredValueNote`, v4 note entry).
 */
export interface MeasuredValueNote {
  Note: string;
  CreatedBy: string;
  Timestamp: string;
}

/**
 * Canonical shape of a single historical value, following the v5 `MeasuredValue`.
 *
 * Version differences (docs/analysis/v4-to-v5-endpoints.md, historian rows):
 * - `Value` is free-form on v5 (`object`), while v4 only ever delivered numbers, strings or
 *   booleans. Treat it as `any`.
 * - `MinTimestamp`, `MinValue`, `MaxTimestamp`, `MaxValue`, `Notes`, `CreatedBy` and the
 *   `Note` carried inside `Source` are v5 additions; on v4 they stay undefined, except that
 *   the v4 adapter lifts a flat `Note`/`CreatedBy` pair into `Notes`.
 * - Flat-row query results (`HistoricalValueMap`) are unrelated to this type; they keep
 *   signal ids as keys.
 */
export interface MeasuredValue {
  /** Start of the interval the value belongs to, ISO 8601. */
  IntervalStart: string;
  Value?: any;
  Manual?: any;
  Note?: string;
  CreatedBy?: string;
  Notes?: MeasuredValueNote[];
  Source?: MeasurementValueSource;
  Status?: number;
  /** v5 only. */
  MinTimestamp?: string;
  /** v5 only. */
  MinValue?: any;
  /** v5 only. */
  MaxTimestamp?: string;
  /** v5 only. */
  MaxValue?: any;

  [propName: string]: any;
}

/**
 * Canonical shape of a packaged value query result, following the v5 `MeasuredValuePackage`.
 * The v4 `HistoricalValueObject` had the same shape.
 */
export interface MeasuredValuePackage {
  ObjectType: ValueObjectType | string;
  ObjectId: string;
  IntervalType: CompressionInterval | string;
  Values: MeasuredValue[];
}
