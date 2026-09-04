import { describe, expect, it } from 'vitest';
import {
  compareVersions,
  compareVersionStrings,
  createApiVersionInfo,
  isAtLeast,
  parseVersion,
} from '../../lib/api/api-version.js';

describe('parseVersion', () => {
  it('parses a plain semver', () => {
    expect(parseVersion('5.0.1')).toMatchObject({ major: 5, minor: 0, patch: 1, prerelease: '' });
  });

  it('parses a platform build version with a date patch and suffix', () => {
    expect(parseVersion('4.23.20260622-abcdef')).toMatchObject({
      major: 4,
      minor: 23,
      patch: 20260622,
      prerelease: 'abcdef',
    });
  });

  it('defaults missing minor and patch to 0', () => {
    expect(parseVersion('5')).toMatchObject({ major: 5, minor: 0, patch: 0 });
    expect(parseVersion('4.16')).toMatchObject({ major: 4, minor: 16, patch: 0 });
  });

  it('tolerates a leading v and surrounding whitespace', () => {
    expect(parseVersion(' v5.1.0 ')).toMatchObject({ major: 5, minor: 1, patch: 0 });
  });

  it('returns null for unparseable input', () => {
    expect(parseVersion('unknown')).toBeNull();
    expect(parseVersion('')).toBeNull();
    expect(parseVersion(null as any)).toBeNull();
  });
});

describe('compareVersions', () => {
  it('orders by major, then minor, then patch', () => {
    expect(compareVersions(parseVersion('5.0.0'), parseVersion('4.23.0'))).toBeGreaterThan(0);
    expect(compareVersions(parseVersion('4.12.0'), parseVersion('4.16.0'))).toBeLessThan(0);
    expect(compareVersions(parseVersion('4.16.1'), parseVersion('4.16.1'))).toBe(0);
  });

  it('ignores the prerelease/build suffix', () => {
    expect(compareVersions(parseVersion('5.1.7-aaa'), parseVersion('5.1.7-zzz'))).toBe(0);
  });

  it('sorts unparseable strings below parseable ones', () => {
    expect(compareVersionStrings('unknown', '4.12')).toBeLessThan(0);
    expect(compareVersionStrings('4.12', 'unknown')).toBeGreaterThan(0);
    expect(compareVersionStrings('unknown', 'unknown')).toBe(0);
  });
});

describe('isAtLeast', () => {
  it('compares against a minimum', () => {
    expect(isAtLeast('4.16.0', '4.16')).toBe(true);
    expect(isAtLeast('4.15.9', '4.16')).toBe(false);
    expect(isAtLeast('5.0.0', '4.23')).toBe(true);
  });

  it('treats an unparseable minimum as no requirement', () => {
    expect(isAtLeast('4.12', 'nonsense')).toBe(true);
  });

  it('never satisfies a minimum with an unparseable version', () => {
    expect(isAtLeast('unknown', '4.12')).toBe(false);
  });
});

describe('createApiVersionInfo', () => {
  it('derives V5 for major 5', () => {
    const info = createApiVersionInfo('5.1.20250902-abc');
    expect(info.apiVersion).toBe('V5');
    expect(info.isV5).toBe(true);
    expect(info.isV4).toBe(false);
    expect(info.platformVersion).toBe('5.1.20250902-abc');
    expect(info.isAtLeast('5.0')).toBe(true);
  });

  it('derives V4 for major 4', () => {
    const info = createApiVersionInfo('4.23.20260622');
    expect(info.apiVersion).toBe('V4');
    expect(info.supports('requiresAcknowledgmentField')).toBe(true);
    expect(info.supports('queryVerb')).toBe(false);
  });

  it('falls back to V4 with a null version for garbage input', () => {
    const info = createApiVersionInfo('unknown');
    expect(info.version).toBeNull();
    expect(info.apiVersion).toBe('V4');
    expect(info.isAtLeast('4.12')).toBe(false);
    expect(info.supports('translations')).toBe(false);
  });
});
