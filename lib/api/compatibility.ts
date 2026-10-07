import { ApiVersionInfo, compareVersions, isAtLeast, parseVersion } from './api-version.js';
import { IncompatibleBackendError } from './errors.js';

/**
 * The version window audako-core itself was built against.
 *
 * - v4: 4.12 - 4.23 inclusive. 4.23 is the final v4 release; a 4.24+ cannot exist.
 * - v5: 5.0 and up. `v5KnownMax` is the newest 5.x minor core was verified against; newer
 *   minors are accepted with a warning because the platform commits to additive-only changes
 *   within the major.
 */
export const CORE_SUPPORTED_WINDOW = {
  v4Min: '4.12',
  v4Max: '4.23',
  v5Min: '5.0',
  v5KnownMax: '5.1',
} as const;

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
export type CompatibilityStatus =
  | 'ok'
  | 'tooOld'
  | 'unknownMajor'
  | 'unsupportedMajor'
  | 'newerThanKnown'
  | 'invalidVersion';

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

function result(
  status: CompatibilityStatus,
  detected: ApiVersionInfo,
  message: string,
  required?: string,
): CompatibilityResult {
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
export function checkCompatibility(
  info: ApiVersionInfo,
  requirements: CompatibilityRequirements = {},
): CompatibilityResult {
  const version = info.version;

  if (!version) {
    return result('invalidVersion', info, `Could not parse the platform version "${info.platformVersion}".`);
  }

  if (version.major >= 6) {
    return result(
      'unknownMajor',
      info,
      `Platform ${info.platformVersion} is newer than audako-core supports (unknown major ${version.major}).`,
    );
  }

  if (version.major >= 5) {
    const minimum = requirements.minVersion || CORE_SUPPORTED_WINDOW.v5Min;
    if (!isAtLeast(version, minimum)) {
      return result('tooOld', info, `Platform ${info.platformVersion} is older than the required ${minimum}.`, minimum);
    }

    const knownMax = parseVersion(CORE_SUPPORTED_WINDOW.v5KnownMax);
    if (knownMax && compareVersions(version, knownMax) > 0 && version.minor > knownMax.minor) {
      return result(
        'newerThanKnown',
        info,
        `Platform ${info.platformVersion} is newer than the ${CORE_SUPPORTED_WINDOW.v5KnownMax} audako-core was built against. Continuing, because 5.x changes are additive.`,
        minimum,
      );
    }

    return result('ok', info, `Platform ${info.platformVersion} is supported.`, minimum);
  }

  if (version.major === 4) {
    // 4.23 is the final v4 release, so anything above it is not a real version.
    if (!isAtLeast(CORE_SUPPORTED_WINDOW.v4Max, `${version.major}.${version.minor}`)) {
      return result(
        'invalidVersion',
        info,
        `Platform ${info.platformVersion} is above the final v4 release ${CORE_SUPPORTED_WINDOW.v4Max} and cannot exist.`,
        CORE_SUPPORTED_WINDOW.v4Max,
      );
    }

    if (requirements.supportsV4 === false) {
      return result(
        'unsupportedMajor',
        info,
        `Platform ${info.platformVersion} is on the v4 line, which this application does not support.`,
        CORE_SUPPORTED_WINDOW.v5Min,
      );
    }

    const minimum = requirements.minV4Version || CORE_SUPPORTED_WINDOW.v4Min;
    if (!isAtLeast(version, minimum)) {
      return result('tooOld', info, `Platform ${info.platformVersion} is older than the required ${minimum}.`, minimum);
    }

    return result('ok', info, `Platform ${info.platformVersion} is supported.`, minimum);
  }

  return result(
    'tooOld',
    info,
    `Platform ${info.platformVersion} is far older than the oldest supported release ${CORE_SUPPORTED_WINDOW.v4Min}.`,
    CORE_SUPPORTED_WINDOW.v4Min,
  );
}

/**
 * Like {@link checkCompatibility} but throws {@link IncompatibleBackendError} when the platform
 * cannot be used. Returns the result on success (including `newerThanKnown`).
 */
export function assertCompatible(
  info: ApiVersionInfo,
  requirements: CompatibilityRequirements = {},
): CompatibilityResult {
  const checked = checkCompatibility(info, requirements);
  if (!checked.compatible) {
    throw new IncompatibleBackendError(checked);
  }
  return checked;
}
