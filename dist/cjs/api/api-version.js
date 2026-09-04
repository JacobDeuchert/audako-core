"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiVersionInfo = exports.apiVersionOf = exports.ApiVersionInfo = exports.isAtLeast = exports.compareVersionStrings = exports.compareVersions = exports.parseVersion = void 0;
const features_js_1 = require("./features.js");
/**
 * Parses a platform/semver-like version string. Missing minor/patch default to 0.
 * Returns `null` for empty, `unknown` or otherwise unparseable input.
 */
function parseVersion(version) {
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
exports.parseVersion = parseVersion;
/**
 * Compares two parsed versions by major/minor/patch. Prerelease/build metadata is ignored,
 * because the platform uses it for build dates and commit hashes, not for ordering.
 * Returns a negative number when `a < b`, 0 when equal, a positive number when `a > b`.
 */
function compareVersions(a, b) {
    return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}
exports.compareVersions = compareVersions;
/**
 * Compares two version strings. Unparseable input sorts below everything parseable.
 */
function compareVersionStrings(a, b) {
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
exports.compareVersionStrings = compareVersionStrings;
/**
 * True when `version` is greater than or equal to `minimum`. Unparseable `version` is never
 * at least anything; an unparseable `minimum` is treated as no requirement.
 */
function isAtLeast(version, minimum) {
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
exports.isAtLeast = isAtLeast;
/**
 * Runtime version information for the platform an app is connected to.
 * Apps ask `supports(feature)` instead of comparing versions themselves.
 */
class ApiVersionInfo {
    constructor(platformVersion, version, apiVersion) {
        this.platformVersion = platformVersion;
        this.version = version;
        this.apiVersion = apiVersion;
    }
    /** True when the connected platform provides the given feature. */
    supports(feature) {
        return (0, features_js_1.isFeatureSupported)(feature, this.version);
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
exports.ApiVersionInfo = ApiVersionInfo;
/**
 * Derives the API generation from a version string. Anything below major 5 is treated as `V4`;
 * the supported-window check in `compatibility.ts` decides whether that version is usable.
 */
function apiVersionOf(version) {
    return version && version.major >= 5 ? 'V5' : 'V4';
}
exports.apiVersionOf = apiVersionOf;
/**
 * Builds an {@link ApiVersionInfo} from an exact platform version string.
 * Unparseable input yields an info object whose `version` is `null`, `supports()` is always false
 * and `apiVersion` falls back to `V4`; `checkCompatibility` reports it as `invalidVersion`.
 */
function createApiVersionInfo(platformVersion) {
    const parsed = parseVersion(platformVersion);
    return new ApiVersionInfo(platformVersion, parsed, apiVersionOf(parsed));
}
exports.createApiVersionInfo = createApiVersionInfo;
