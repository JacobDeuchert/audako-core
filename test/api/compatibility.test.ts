import { describe, expect, it } from 'vitest';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { assertCompatible, checkCompatibility, CORE_SUPPORTED_WINDOW } from '../../lib/api/compatibility.js';
import { IncompatibleBackendError } from '../../lib/api/errors.js';

const check = (version: string, requirements?: any) => checkCompatibility(createApiVersionInfo(version), requirements);

describe('checkCompatibility', () => {
  it('accepts the oldest and newest supported v4', () => {
    expect(check('4.12.20231011').status).toBe('ok');
    expect(check('4.23.20260622').status).toBe('ok');
  });

  it('accepts a v5 inside the known window', () => {
    expect(check('5.0.0').status).toBe('ok');
    expect(check(`${CORE_SUPPORTED_WINDOW.v5KnownMax}.0`).status).toBe('ok');
  });

  it('reports tooOld below the v4 minimum', () => {
    const result = check('4.11.0');
    expect(result.status).toBe('tooOld');
    expect(result.compatible).toBe(false);
    expect(result.required).toBe(CORE_SUPPORTED_WINDOW.v4Min);
  });

  it('reports tooOld for a pre-4 major', () => {
    expect(check('3.9.0').status).toBe('tooOld');
  });

  it('reports tooOld below an app-declared v4 minimum', () => {
    const result = check('4.15.0', { minV4Version: '4.16' });
    expect(result.status).toBe('tooOld');
    expect(result.required).toBe('4.16');
  });

  it('reports tooOld below an app-declared v5 minimum', () => {
    const result = check('5.0.0', { minVersion: '5.1' });
    expect(result.status).toBe('tooOld');
    expect(result.required).toBe('5.1');
  });

  it('reports invalidVersion for a 4.x above the final 4.23', () => {
    const result = check('4.24.0');
    expect(result.status).toBe('invalidVersion');
    expect(result.compatible).toBe(false);
  });

  it('reports invalidVersion for an unparseable version', () => {
    expect(check('unknown').status).toBe('invalidVersion');
  });

  it('reports unsupportedMajor when the app opts out of v4', () => {
    const result = check('4.23.0', { supportsV4: false });
    expect(result.status).toBe('unsupportedMajor');
    expect(result.required).toBe(CORE_SUPPORTED_WINDOW.v5Min);
  });

  it('reports unknownMajor for major 6 and above', () => {
    const result = check('6.0.0');
    expect(result.status).toBe('unknownMajor');
    expect(result.compatible).toBe(false);
  });

  it('reports newerThanKnown for a 5.x minor above the known maximum, but stays compatible', () => {
    const result = check('5.99.0');
    expect(result.status).toBe('newerThanKnown');
    expect(result.compatible).toBe(true);
    expect(result.message).toContain('additive');
  });

  it('always fills detected and message', () => {
    const result = check('4.20.0');
    expect(result.detected.platformVersion).toBe('4.20.0');
    expect(result.message.length).toBeGreaterThan(0);
  });
});

describe('assertCompatible', () => {
  it('returns the result for a supported platform', () => {
    expect(assertCompatible(createApiVersionInfo('5.0.0')).status).toBe('ok');
  });

  it('returns the result for a newer-than-known platform', () => {
    expect(assertCompatible(createApiVersionInfo('5.99.0')).status).toBe('newerThanKnown');
  });

  it('throws IncompatibleBackendError carrying the result', () => {
    try {
      assertCompatible(createApiVersionInfo('4.11.0'));
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(IncompatibleBackendError);
      expect((error as IncompatibleBackendError).result.status).toBe('tooOld');
    }
  });
});
