import { isAtLeast, SemVer } from './api-version.js';

/**
 * Capabilities an app can ask about instead of comparing platform versions.
 *
 * - `translations`     `TranslatableField.Translations` appears on the wire (>= 4.16).
 * - `entityMappings`   `DashboardTab.EntityMappings` can be written without data loss (>= 4.15).
 * - `queryVerb`        entity queries use the `QUERY` verb on the collection root (>= 5.0).
 * - `entityCount`      `GET {segment}/count?$filter=` exists (>= 5.0).
 * - `entityInfo`       `GET {segment}/entity-info` exists (>= 5.0).
 * - `optimisticConcurrency` `ChangedOn` is an update token that must be round-tripped (>= 5.0).
 * - `historicalValueOperationsV2` `historical-value-operations` shape with `UserId`/`StartedOn` (>= 5.0).
 * - `requiresAcknowledgmentField` `EventCategory.RequiresAcknowledgment` is the wire name (>= 4.23).
 * - `acknowledgmentField` `EventCategory.Acknowledgment` exists next to `RequiresAcknowledgment` (>= 5.0).
 */
export type Feature =
  | 'translations'
  | 'entityMappings'
  | 'queryVerb'
  | 'entityCount'
  | 'entityInfo'
  | 'optimisticConcurrency'
  | 'historicalValueOperationsV2'
  | 'requiresAcknowledgmentField'
  | 'acknowledgmentField';

/**
 * Minimum platform version per feature. Add an entry here to add a feature; only use
 * {@link FEATURE_PREDICATES} directly when a feature is not a simple lower bound.
 */
export const FEATURE_MIN_VERSIONS: Record<Feature, string> = {
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

/** Predicate on a parsed platform version. `null` means the version could not be parsed. */
export type FeaturePredicate = (version: SemVer | null) => boolean;

function atLeast(minimum: string): FeaturePredicate {
  return (version) => (version ? isAtLeast(version, minimum) : false);
}

/**
 * Feature -> predicate map. Derived from {@link FEATURE_MIN_VERSIONS}; individual entries can be
 * overwritten with a hand-written predicate for features that are not a plain lower bound
 * (for example a capability removed again in a later major).
 */
export const FEATURE_PREDICATES: Record<Feature, FeaturePredicate> = (
  Object.keys(FEATURE_MIN_VERSIONS) as Feature[]
).reduce(
  (map, feature) => {
    map[feature] = atLeast(FEATURE_MIN_VERSIONS[feature]);
    return map;
  },
  {} as Record<Feature, FeaturePredicate>,
);

/** All known feature names. */
export const ALL_FEATURES: Feature[] = Object.keys(FEATURE_MIN_VERSIONS) as Feature[];

/** True when the given parsed version provides the feature. Unknown features are unsupported. */
export function isFeatureSupported(feature: Feature, version: SemVer | null): boolean {
  const predicate = FEATURE_PREDICATES[feature];
  return predicate ? predicate(version) : false;
}
