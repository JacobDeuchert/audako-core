import { describe, expect, it } from 'vitest';
import { createApiVersionInfo, parseVersion } from '../../lib/api/api-version.js';
import { ALL_FEATURES, FEATURE_MIN_VERSIONS, Feature, isFeatureSupported } from '../../lib/api/features.js';

describe('features', () => {
  it('covers every declared feature with a minimum version', () => {
    expect(ALL_FEATURES.sort()).toEqual(Object.keys(FEATURE_MIN_VERSIONS).sort());
  });

  it('supports a feature exactly at its minimum version', () => {
    for (const feature of ALL_FEATURES) {
      const minimum = parseVersion(FEATURE_MIN_VERSIONS[feature]);
      expect(isFeatureSupported(feature, minimum)).toBe(true);
    }
  });

  it('does not support a feature one minor below its minimum', () => {
    for (const feature of ALL_FEATURES) {
      const minimum = parseVersion(FEATURE_MIN_VERSIONS[feature]);
      const below = { ...minimum, minor: minimum.minor - 1 };
      if (below.minor < 0) {
        continue;
      }
      expect(isFeatureSupported(feature, below)).toBe(false);
    }
  });

  it('reports the expected feature set for 4.12', () => {
    const info = createApiVersionInfo('4.12.20231011');
    expect(info.supports('translations')).toBe(false);
    expect(info.supports('entityMappings')).toBe(false);
    expect(info.supports('requiresAcknowledgmentField')).toBe(false);
    expect(info.supports('queryVerb')).toBe(false);
  });

  it('reports the expected feature set for 4.16', () => {
    const info = createApiVersionInfo('4.16.20241018');
    expect(info.supports('translations')).toBe(true);
    expect(info.supports('entityMappings')).toBe(true);
    expect(info.supports('requiresAcknowledgmentField')).toBe(false);
  });

  it('reports every feature for 5.0', () => {
    const info = createApiVersionInfo('5.0.0');
    for (const feature of ALL_FEATURES) {
      expect(info.supports(feature), feature).toBe(true);
    }
  });

  it('treats an unknown feature as unsupported', () => {
    expect(isFeatureSupported('nope' as Feature, parseVersion('5.0.0'))).toBe(false);
  });

  it('treats an unparseable version as supporting nothing', () => {
    expect(isFeatureSupported('translations', null)).toBe(false);
  });
});
