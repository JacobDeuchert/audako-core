import { isFeatureSupported } from './features.js';
/**
 * Parses a platform/semver-like version string. Missing minor/patch default to 0.
 * Returns `null` for empty, `unknown` or otherwise unparseable input.
 */
export function parseVersion(version) {
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
export function compareVersions(a, b) {
    return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}
/**
 * Compares two version strings. Unparseable input sorts below everything parseable.
 */
export function compareVersionStrings(a, b) {
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
export function isAtLeast(version, minimum) {
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
    constructor(platformVersion, version, apiVersion) {
        this.platformVersion = platformVersion;
        this.version = version;
        this.apiVersion = apiVersion;
    }
    /** True when the connected platform provides the given feature. */
    supports(feature) {
        return isFeatureSupported(feature, this.version);
    }
    /** True when the connected platform is at least the given version (e.g. `'4.16'`, `'5.0'`). */
    isAtLeast(version) {
        return this.version ? isAtLeast(this.version, version) : false;
    }
    /** True when the connected platform is on the v4 line. */
    get isV4() {
        return this.apiVersion === 'V4';
    }
    /** True when the connected platform is on the v5 line. */
    get isV5() {
        return this.apiVersion === 'V5';
    }
}
/**
 * Derives the API generation from a version string. Anything below major 5 is treated as `V4`;
 * the supported-window check in `compatibility.ts` decides whether that version is usable.
 */
export function apiVersionOf(version) {
    return version && version.major >= 5 ? 'V5' : 'V4';
}
/**
 * Builds an {@link ApiVersionInfo} from an exact platform version string.
 * Unparseable input yields an info object whose `version` is `null`, `supports()` is always false
 * and `apiVersion` falls back to `V4`; `checkCompatibility` reports it as `invalidVersion`.
 */
export function createApiVersionInfo(platformVersion) {
    const parsed = parseVersion(platformVersion);
    return new ApiVersionInfo(platformVersion, parsed, apiVersionOf(parsed));
}
