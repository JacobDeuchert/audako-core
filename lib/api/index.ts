export {
  ApiVersion,
  ApiVersionInfo,
  SemVer,
  apiVersionOf,
  compareVersions,
  compareVersionStrings,
  createApiVersionInfo,
  isAtLeast,
  parseVersion,
} from './api-version.js';
export {
  ALL_FEATURES,
  FEATURE_MIN_VERSIONS,
  FEATURE_PREDICATES,
  Feature,
  FeaturePredicate,
  isFeatureSupported,
} from './features.js';
export {
  DetectApiVersionOptions,
  V4_VERSION_PATH,
  V5_VERSION_PATH,
  detectApiVersion,
  isApiReachable,
  normalizeVersionBody,
} from './version-detection.js';
export {
  CORE_SUPPORTED_WINDOW,
  CompatibilityRequirements,
  CompatibilityResult,
  CompatibilityStatus,
  assertCompatible,
  checkCompatibility,
} from './compatibility.js';
export { DeprecationRecord, DeprecationSink, getDeprecatedPaths, setDeprecationSink } from './deprecation.js';
export {
  ApiError,
  EndpointNotAvailableError,
  ApiVersionDetectionError,
  EntityLockedError,
  IncompatibleBackendError,
  UnsupportedApiVersionError,
  parseApiError,
} from './errors.js';
export { ApiContext, ApiContextOptions, RequestOptions, requestHttpConfig } from './api-context.js';
