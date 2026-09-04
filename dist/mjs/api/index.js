export { ApiVersionInfo, apiVersionOf, compareVersions, compareVersionStrings, createApiVersionInfo, isAtLeast, parseVersion, } from './api-version.js';
export { ALL_FEATURES, FEATURE_MIN_VERSIONS, FEATURE_PREDICATES, isFeatureSupported, } from './features.js';
export { V4_VERSION_PATH, V5_VERSION_PATH, detectApiVersion, normalizeVersionBody, } from './version-detection.js';
export { CORE_SUPPORTED_WINDOW, assertCompatible, checkCompatibility, } from './compatibility.js';
export { ApiError, ApiVersionDetectionError, EntityLockedError, IncompatibleBackendError, UnsupportedApiVersionError, parseApiError, } from './errors.js';
export { ApiContext, requestHttpConfig } from './api-context.js';
