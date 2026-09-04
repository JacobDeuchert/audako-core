import { ApiVersionInfo } from './api-version.js';
/**
 * The version window audako-core itself was built against.
 *
 * - v4: 4.12 - 4.23 inclusive. 4.23 is the final v4 release; a 4.24+ cannot exist.
 * - v5: 5.0 and up. `v5KnownMax` is the newest 5.x minor core was verified against; newer
 *   minors are accepted with a warning because the platform commits to additive-only changes
 *   within the major.
 */
export declare const CORE_SUPPORTED_WINDOW: {
    readonly v4Min: "4.12";
    readonly v4Max: "4.23";
    readonly v5Min: "5.0";
    readonly v5KnownMax: "5.1";
};
/**
 * Additional requirements an app layers on top of core's own window.
 */
export interface CompatibilityRequirements {
    /** Minimum version on the 5.x line, e.g. `'5.2'`. Ignored for v4 backends. */
    minVersion?: string;
    /** Whether the app works against v4 at all. Defaults to `true`. */
    supportsV4?: boolean;
    /** Minimum version on the 4.x line, e.g. `'4.16'`. Only used when `supportsV4` is not false. */
    minV4Version?: string;
}
/**
 * Outcome of a compatibility check.
 *
 * - `ok`               usable, possibly with a warning.
 * - `tooOld`           below core's or the app's minimum on the detected line.
 * - `unsupportedMajor` the major exists but the app declared it unsupported (v4 opt-out).
 * - `unknownMajor`     major 6 or higher: core knows nothing about it, blocked.
 * - `newerThanKnown`   5.x newer than core was built against: allowed, warning only.
 * - `invalidVersion`   version string unparseable, or a 4.x above the final 4.23.
 */
export type CompatibilityStatus = 'ok' | 'tooOld' | 'unknownMajor' | 'unsupportedMajor' | 'newerThanKnown' | 'invalidVersion';
export interface CompatibilityResult {
    status: CompatibilityStatus;
    /** True for `ok` and `newerThanKnown`. */
    compatible: boolean;
    /** Version info the check ran against. */
    detected: ApiVersionInfo;
    /** The effective minimum that applied on the detected line, when there was one. */
    required?: string;
    /** Human readable explanation, always set. */
    message: string;
}
/**
 * Checks a detected platform version against core's supported window and the app's own
 * requirements. Never throws; use {@link assertCompatible} for the throwing variant.
 */
export declare function checkCompatibility(info: ApiVersionInfo, requirements?: CompatibilityRequirements): CompatibilityResult;
/**
 * Like {@link checkCompatibility} but throws {@link IncompatibleBackendError} when the platform
 * cannot be used. Returns the result on success (including `newerThanKnown`).
 */
export declare function assertCompatible(info: ApiVersionInfo, requirements?: CompatibilityRequirements): CompatibilityResult;
