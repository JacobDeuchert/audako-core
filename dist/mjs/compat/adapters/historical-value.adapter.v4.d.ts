import { ApiVersionInfo } from '../../api/api-version.js';
import { MeasuredValue, MeasuredValuePackage } from '../../models/historical-value.model.js';
/**
 * Wire mapping for the historian value endpoints
 * (docs/analysis/v4-to-v5-endpoints.md, historian rows).
 *
 * The types here are declared structurally on purpose: the public request/response types live
 * in `lib/services/historical-value.service.ts`, and importing them would create a cycle.
 */
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
 * Normalizes a single value payload to the canonical `MeasuredValue`.
 *
 * v5 already answers with a full `MeasuredValue` (every property present, `Value` free-form).
 * v4 answered with the flat historical value, which carried at most one note as the
 * `Note`/`CreatedBy` pair - that pair is lifted into `Notes` so callers only have to read one
 * shape. The v5-only `Min*`/`Max*` fields stay undefined on v4.
 */
export declare function measuredValueFromWire(wire: any, versionInfo: ApiVersionInfo): MeasuredValue;
/** {@link measuredValueFromWire} applied to a `MeasuredValuePackage` / v4 `HistoricalValueObject`. */
export declare function measuredValuePackageFromWire(wire: any, versionInfo: ApiVersionInfo): MeasuredValuePackage;
/**
 * Puts the custom counter offset body in the casing the target version expects.
 *
 * v4 read the body camelCase (`{timestamp, value, note, source}`); v5 uses PascalCase
 * (`SetCounterCustomOffsetRequest {Timestamp, Value, Note?, Source}`) and there is no legacy
 * rewrite for the endpoint, so the casing has to be right.
 */
export declare function customOffsetBodyToWire(body: CustomOffsetBody, versionInfo: ApiVersionInfo): any;
