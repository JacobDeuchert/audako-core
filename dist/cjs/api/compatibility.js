"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCompatible = exports.checkCompatibility = exports.CORE_SUPPORTED_WINDOW = void 0;
const api_version_js_1 = require("./api-version.js");
const errors_js_1 = require("./errors.js");
/**
 * The version window audako-core itself was built against.
 *
 * - v4: 4.12 - 4.23 inclusive. 4.23 is the final v4 release; a 4.24+ cannot exist.
 * - v5: 5.0 and up. `v5KnownMax` is the newest 5.x minor core was verified against; newer
 *   minors are accepted with a warning because the platform commits to additive-only changes
 *   within the major.
 */
exports.CORE_SUPPORTED_WINDOW = {
    v4Min: '4.12',
    v4Max: '4.23',
    v5Min: '5.0',
    v5KnownMax: '5.1',
};
function result(status, detected, message, required) {
    return {
        status: status,
        compatible: status === 'ok' || status === 'newerThanKnown',
        detected: detected,
        required: required,
        message: message,
    };
}
/**
 * Checks a detected platform version against core's supported window and the app's own
 * requirements. Never throws; use {@link assertCompatible} for the throwing variant.
 */
function checkCompatibility(info, requirements = {}) {
    const version = info.version;
    if (!version) {
        return result('invalidVersion', info, `Could not parse the platform version "${info.platformVersion}".`);
    }
    if (version.major >= 6) {
        return result('unknownMajor', info, `Platform ${info.platformVersion} is newer than audako-core supports (unknown major ${version.major}).`);
    }
    if (version.major >= 5) {
        const minimum = requirements.minVersion || exports.CORE_SUPPORTED_WINDOW.v5Min;
        if (!(0, api_version_js_1.isAtLeast)(version, minimum)) {
            return result('tooOld', info, `Platform ${info.platformVersion} is older than the required ${minimum}.`, minimum);
        }
        const knownMax = (0, api_version_js_1.parseVersion)(exports.CORE_SUPPORTED_WINDOW.v5KnownMax);
        if (knownMax && (0, api_version_js_1.compareVersions)(version, knownMax) > 0 && version.minor > knownMax.minor) {
            return result('newerThanKnown', info, `Platform ${info.platformVersion} is newer than the ${exports.CORE_SUPPORTED_WINDOW.v5KnownMax} audako-core was built against. Continuing, because 5.x changes are additive.`, minimum);
        }
        return result('ok', info, `Platform ${info.platformVersion} is supported.`, minimum);
    }
    if (version.major === 4) {
        // 4.23 is the final v4 release, so anything above it is not a real version.
        if (!(0, api_version_js_1.isAtLeast)(exports.CORE_SUPPORTED_WINDOW.v4Max, `${version.major}.${version.minor}`)) {
            return result('invalidVersion', info, `Platform ${info.platformVersion} is above the final v4 release ${exports.CORE_SUPPORTED_WINDOW.v4Max} and cannot exist.`, exports.CORE_SUPPORTED_WINDOW.v4Max);
        }
        if (requirements.supportsV4 === false) {
            return result('unsupportedMajor', info, `Platform ${info.platformVersion} is on the v4 line, which this application does not support.`, exports.CORE_SUPPORTED_WINDOW.v5Min);
        }
        const minimum = requirements.minV4Version || exports.CORE_SUPPORTED_WINDOW.v4Min;
        if (!(0, api_version_js_1.isAtLeast)(version, minimum)) {
            return result('tooOld', info, `Platform ${info.platformVersion} is older than the required ${minimum}.`, minimum);
        }
        return result('ok', info, `Platform ${info.platformVersion} is supported.`, minimum);
    }
    return result('tooOld', info, `Platform ${info.platformVersion} is far older than the oldest supported release ${exports.CORE_SUPPORTED_WINDOW.v4Min}.`, exports.CORE_SUPPORTED_WINDOW.v4Min);
}
exports.checkCompatibility = checkCompatibility;
/**
 * Like {@link checkCompatibility} but throws {@link IncompatibleBackendError} when the platform
 * cannot be used. Returns the result on success (including `newerThanKnown`).
 */
function assertCompatible(info, requirements = {}) {
    const checked = checkCompatibility(info, requirements);
    if (!checked.compatible) {
        throw new errors_js_1.IncompatibleBackendError(checked);
    }
    return checked;
}
exports.assertCompatible = assertCompatible;
