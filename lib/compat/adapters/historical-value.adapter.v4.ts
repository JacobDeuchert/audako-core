import { ApiVersionInfo } from '../../api/api-version.js';
import { MeasuredValue, MeasuredValueNote, MeasuredValuePackage } from '../../models/historical-value.model.js';

/**
 * Wire mapping for the historian value endpoints
 * (docs/analysis/v4-to-v5-endpoints.md, historian rows).
 *
 * The types here are declared structurally on purpose: the public request/response types live
 * in `lib/services/historical-value.service.ts`, and importing them would create a cycle.
 */

/** The two fields of a value query that differ between the versions. */
export interface ValueQueryLike {
  /**
   * @deprecated v4 only, dropped in v5.
   */
  MinMaxInterval?: any;
  MinMaxIntervalType?: any;
  [key: string]: any;
}

/**
 * Canonical (v5) `SetCounterCustomOffsetRequest` body. v5 serializes with
 * `PropertyNamingPolicy = null`, so the keys are PascalCase.
 */
export interface CustomOffsetBody {
  Timestamp: string;
  Value: number;
  Note?: string | null;
  Source: string;
}

/**
 * Prepares a value query for the wire.
 *
 * v5 dropped `MinMaxInterval` from `ValueQuery`; only `MinMaxIntervalType` remains. The field
 * is stripped on v5, and - because both fields carried a `CompressionInterval` - its value is
 * promoted to `MinMaxIntervalType` when the caller did not set that itself, so old call sites
 * keep the min/max behaviour they asked for.
 */
export function valueQueryToWire<T extends ValueQueryLike>(query: T, versionInfo: ApiVersionInfo): any {
  if (!query || typeof query !== 'object' || !versionInfo?.isV5) {
    return query;
  }

  if (query.MinMaxInterval === undefined) {
    return query;
  }

  const payload: any = { ...query };
  if (payload.MinMaxIntervalType === undefined || payload.MinMaxIntervalType === null) {
    payload.MinMaxIntervalType = payload.MinMaxInterval;
  }
  delete payload.MinMaxInterval;
  return payload;
}

/** {@link valueQueryToWire} for a list of queries. */
export function valueQueriesToWire<T extends ValueQueryLike>(queries: T[], versionInfo: ApiVersionInfo): any[] {
  if (!Array.isArray(queries)) {
    return queries as any;
  }
  return queries.map((query) => valueQueryToWire(query, versionInfo));
}

/**
 * Normalizes a single value payload to the canonical `MeasuredValue`.
 *
 * v5 already answers with a full `MeasuredValue` (every property present, `Value` free-form).
 * v4 answered with the flat historical value, which carried at most one note as the
 * `Note`/`CreatedBy` pair - that pair is lifted into `Notes` so callers only have to read one
 * shape. The v5-only `Min*`/`Max*` fields stay undefined on v4.
 */
export function measuredValueFromWire(wire: any, versionInfo: ApiVersionInfo): MeasuredValue {
  if (!wire || typeof wire !== 'object') {
    return wire;
  }

  if (versionInfo?.isV5) {
    return wire as MeasuredValue;
  }

  const value: MeasuredValue = { ...wire };
  if (!Array.isArray(value.Notes) && value.Note) {
    value.Notes = [
      {
        Note: value.Note,
        CreatedBy: value.CreatedBy,
        Timestamp: value.IntervalStart,
      } as MeasuredValueNote,
    ];
  }
  return value;
}

/** {@link measuredValueFromWire} applied to a `MeasuredValuePackage` / v4 `HistoricalValueObject`. */
export function measuredValuePackageFromWire(wire: any, versionInfo: ApiVersionInfo): MeasuredValuePackage {
  if (!wire || typeof wire !== 'object') {
    return wire;
  }

  if (versionInfo?.isV5 || !Array.isArray(wire.Values)) {
    return wire as MeasuredValuePackage;
  }

  return {
    ...wire,
    Values: wire.Values.map((value: any) => measuredValueFromWire(value, versionInfo)),
  } as MeasuredValuePackage;
}

/**
 * Puts the custom counter offset body in the casing the target version expects.
 *
 * v4 read the body camelCase (`{timestamp, value, note, source}`); v5 uses PascalCase
 * (`SetCounterCustomOffsetRequest {Timestamp, Value, Note?, Source}`) and there is no legacy
 * rewrite for the endpoint, so the casing has to be right.
 */
export function customOffsetBodyToWire(body: CustomOffsetBody, versionInfo: ApiVersionInfo): any {
  if (versionInfo?.isV5) {
    return {
      Timestamp: body.Timestamp,
      Value: body.Value,
      Note: body.Note ?? null,
      Source: body.Source,
    };
  }

  return {
    timestamp: body.Timestamp,
    value: body.Value,
    note: body.Note ?? null,
    source: body.Source,
  };
}
