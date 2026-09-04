import { Feature } from './features.js';
/**
 * API generation of an audako platform. `V4` covers 4.12 - 4.23, `V5` covers 5.x.
 */
export type ApiVersion = 'V4' | 'V5';
/**
 * Parsed platform version. Platform versions look like `4.23.20260622-abcdef` or `5.1.20250902-abc`,
 * so `patch` is frequently a build date rather than a real patch level.
 */
export interface SemVer {
    major: number;
    minor: number;
    patch: number;
    /** Everything after the first `-`, without the leading dash. Empty string when absent. */
    prerelease: string;
    /** The original input string. */
    raw: string;
}
/**
 * Parses a platform/semver-like version string. Missing minor/patch default to 0.
 * Returns `null` for empty, `unknown` or otherwise unparseable input.
 */
export declare function parseVersion(version: string): SemVer | null;
/**
 * Compares two parsed versions by major/minor/patch. Prerelease/build metadata is ignored,
 * because the platform uses it for build dates and commit hashes, not for ordering.
 * Returns a negative number when `a < b`, 0 when equal, a positive number when `a > b`.
 */
export declare function compareVersions(a: SemVer, b: SemVer): number;
/**
 * Compares two version strings. Unparseable input sorts below everything parseable.
 */
export declare function compareVersionStrings(a: string, b: string): number;
/**
 * True when `version` is greater than or equal to `minimum`. Unparseable `version` is never
 * at least anything; an unparseable `minimum` is treated as no requirement.
 */
export declare function isAtLeast(version: SemVer | string, minimum: string): boolean;
/**
 * Runtime version information for the platform an app is connected to.
 * Apps ask `supports(feature)` instead of comparing versions themselves.
 */
export declare class ApiVersionInfo {
    /** API generation derived from the major version. */
    readonly apiVersion: ApiVersion;
    /** Exact version string as reported by the platform. */
    readonly platformVersion: string;
    /** Parsed form of {@link platformVersion}, or `null` when the platform reported garbage. */
    readonly version: SemVer | null;
    constructor(platformVersion: string, version: SemVer | null, apiVersion: ApiVersion);
    /** True when the connected platform provides the given feature. */
    supports(feature: Feature): boolean;
    /** True when the connected platform is at least the given version (e.g. `'4.16'`, `'5.0'`). */
    isAtLeast(version: string): boolean;
    /** True when the connected platform is on the v4 line. */
    get isV4(): boolean;
    /** True when the connected platform is on the v5 line. */
    get isV5(): boolean;
}
/**
 * Derives the API generation from a version string. Anything below major 5 is treated as `V4`;
 * the supported-window check in `compatibility.ts` decides whether that version is usable.
 */
export declare function apiVersionOf(version: SemVer | null): ApiVersion;
/**
 * Builds an {@link ApiVersionInfo} from an exact platform version string.
 * Unparseable input yields an info object whose `version` is `null`, `supports()` is always false
 * and `apiVersion` falls back to `V4`; `checkCompatibility` reports it as `invalidVersion`.
 */
export declare function createApiVersionInfo(platformVersion: string): ApiVersionInfo;
