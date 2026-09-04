import { Feature, isFeatureSupported } from './features.js';

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
export function parseVersion(version: string): SemVer | null {
  if (!version || typeof version !== 'string') {
    return null;
  }

  const raw = version.trim();
  const match = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:[-+](.*))?$/.exec(raw);
  if (!match) {
    return null;
  }

  return {
    major: parseInt(match[1], 10),
    minor: match[2] ? parseInt(match[2], 10) : 0,
    patch: match[3] ? parseInt(match[3], 10) : 0,
    prerelease: match[4] || '',
    raw: raw,
  };
}

/**
 * Compares two parsed versions by major/minor/patch. Prerelease/build metadata is ignored,
 * because the platform uses it for build dates and commit hashes, not for ordering.
 * Returns a negative number when `a < b`, 0 when equal, a positive number when `a > b`.
 */
export function compareVersions(a: SemVer, b: SemVer): number {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

/**
 * Compares two version strings. Unparseable input sorts below everything parseable.
 */
export function compareVersionStrings(a: string, b: string): number {
  const parsedA = parseVersion(a);
  const parsedB = parseVersion(b);
  if (!parsedA && !parsedB) {
    return 0;
  }
  if (!parsedA) {
    return -1;
  }
  if (!parsedB) {
    return 1;
  }
  return compareVersions(parsedA, parsedB);
}

/**
 * True when `version` is greater than or equal to `minimum`. Unparseable `version` is never
 * at least anything; an unparseable `minimum` is treated as no requirement.
 */
export function isAtLeast(version: SemVer | string, minimum: string): boolean {
  const parsedMinimum = parseVersion(minimum);
  if (!parsedMinimum) {
    return true;
  }

  const parsed = typeof version === 'string' ? parseVersion(version) : version;
  if (!parsed) {
    return false;
  }

  return compareVersions(parsed, parsedMinimum) >= 0;
}

/**
 * Runtime version information for the platform an app is connected to.
 * Apps ask `supports(feature)` instead of comparing versions themselves.
 */
export class ApiVersionInfo {
  /** API generation derived from the major version. */
  public readonly apiVersion: ApiVersion;
  /** Exact version string as reported by the platform. */
  public readonly platformVersion: string;
  /** Parsed form of {@link platformVersion}, or `null` when the platform reported garbage. */
  public readonly version: SemVer | null;

  constructor(platformVersion: string, version: SemVer | null, apiVersion: ApiVersion) {
    this.platformVersion = platformVersion;
    this.version = version;
    this.apiVersion = apiVersion;
  }

  /** True when the connected platform provides the given feature. */
  public supports(feature: Feature): boolean {
    return isFeatureSupported(feature, this.version);
  }

  /** True when the connected platform is at least the given version (e.g. `'4.16'`, `'5.0'`). */
  public isAtLeast(version: string): boolean {
    return this.version ? isAtLeast(this.version, version) : false;
  }

  /** True when the connected platform is on the v4 line. */
  public get isV4(): boolean {
    return this.apiVersion === 'V4';
  }

  /** True when the connected platform is on the v5 line. */
  public get isV5(): boolean {
    return this.apiVersion === 'V5';
  }
}

/**
 * Derives the API generation from a version string. Anything below major 5 is treated as `V4`;
 * the supported-window check in `compatibility.ts` decides whether that version is usable.
 */
export function apiVersionOf(version: SemVer | null): ApiVersion {
  return version && version.major >= 5 ? 'V5' : 'V4';
}

/**
 * Builds an {@link ApiVersionInfo} from an exact platform version string.
 * Unparseable input yields an info object whose `version` is `null`, `supports()` is always false
 * and `apiVersion` falls back to `V4`; `checkCompatibility` reports it as `invalidVersion`.
 */
export function createApiVersionInfo(platformVersion: string): ApiVersionInfo {
  const parsed = parseVersion(platformVersion);
  return new ApiVersionInfo(platformVersion, parsed, apiVersionOf(parsed));
}
