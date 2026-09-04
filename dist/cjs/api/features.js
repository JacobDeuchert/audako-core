"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFeatureSupported = exports.ALL_FEATURES = exports.FEATURE_PREDICATES = exports.FEATURE_MIN_VERSIONS = void 0;
const api_version_js_1 = require("./api-version.js");
/**
 * Minimum platform version per feature. Add an entry here to add a feature; only use
 * {@link FEATURE_PREDICATES} directly when a feature is not a simple lower bound.
 */
exports.FEATURE_MIN_VERSIONS = {
    translations: '4.16',
    entityMappings: '4.15',
    queryVerb: '5.0',
    entityCount: '5.0',
    entityInfo: '5.0',
    optimisticConcurrency: '5.0',
    historicalValueOperationsV2: '5.0',
    requiresAcknowledgmentField: '4.23',
    acknowledgmentField: '5.0',
};
function atLeast(minimum) {
    return (version) => (version ? (0, api_version_js_1.isAtLeast)(version, minimum) : false);
}
/**
 * Feature -> predicate map. Derived from {@link FEATURE_MIN_VERSIONS}; individual entries can be
 * overwritten with a hand-written predicate for features that are not a plain lower bound
 * (for example a capability removed again in a later major).
 */
exports.FEATURE_PREDICATES = Object.keys(exports.FEATURE_MIN_VERSIONS).reduce((map, feature) => {
    map[feature] = atLeast(exports.FEATURE_MIN_VERSIONS[feature]);
    return map;
}, {});
/** All known feature names. */
exports.ALL_FEATURES = Object.keys(exports.FEATURE_MIN_VERSIONS);
/** True when the given parsed version provides the feature. Unknown features are unsupported. */
function isFeatureSupported(feature, version) {
    const predicate = exports.FEATURE_PREDICATES[feature];
    return predicate ? predicate(version) : false;
}
exports.isFeatureSupported = isFeatureSupported;
