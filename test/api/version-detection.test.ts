import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

import axios from 'axios';
import {
  detectApiVersion,
  normalizeVersionBody,
  V4_VERSION_PATH,
  V5_VERSION_PATH,
} from '../../lib/api/version-detection.js';
import { ApiVersionDetectionError } from '../../lib/api/errors.js';

const get = axios.get as unknown as ReturnType<typeof vi.fn>;

/** Answers the given path with a 200 body and 404s everything else. */
function respondOn(path: string, body: unknown) {
  get.mockImplementation((url: string) =>
    url.endsWith(path) ? Promise.resolve({ status: 200, data: body }) : Promise.resolve({ status: 404, data: '' }),
  );
}

describe('normalizeVersionBody', () => {
  it('accepts a bare string', () => {
    expect(normalizeVersionBody('5.1.20250902-abc')).toBe('5.1.20250902-abc');
  });

  it('unwraps a JSON-quoted string', () => {
    expect(normalizeVersionBody('"5.1.0"')).toBe('5.1.0');
  });

  it('rejects HTML, empty bodies, "unknown" and non-strings', () => {
    expect(normalizeVersionBody('<!DOCTYPE html><html></html>')).toBeNull();
    expect(normalizeVersionBody('  ')).toBeNull();
    expect(normalizeVersionBody('unknown')).toBeNull();
    expect(normalizeVersionBody({ version: '5.0' })).toBeNull();
  });
});

describe('detectApiVersion', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('probes the v1 path first and reads a bare string', async () => {
    respondOn(V5_VERSION_PATH, '5.1.20250902-abcdef');

    const info = await detectApiVersion('https://host');

    expect(info.apiVersion).toBe('V5');
    expect(info.platformVersion).toBe('5.1.20250902-abcdef');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get.mock.calls[0][0]).toBe(`https://host${V5_VERSION_PATH}`);
  });

  it('accepts a JSON-quoted version string', async () => {
    respondOn(V5_VERSION_PATH, '"5.0.0"');

    const info = await detectApiVersion('https://host');

    expect(info.platformVersion).toBe('5.0.0');
    expect(info.apiVersion).toBe('V5');
  });

  it('falls back to the legacy path when the v1 path 404s', async () => {
    respondOn(V4_VERSION_PATH, '4.23.20260622-abcdef');

    const info = await detectApiVersion('https://host/');

    expect(info.apiVersion).toBe('V4');
    expect(info.platformVersion).toBe('4.23.20260622-abcdef');
    expect(get.mock.calls.map((call: any[]) => call[0])).toEqual([
      `https://host${V5_VERSION_PATH}`,
      `https://host${V4_VERSION_PATH}`,
    ]);
  });

  it('falls back when the v1 probe throws', async () => {
    get.mockImplementation((url: string) =>
      url.endsWith(V5_VERSION_PATH)
        ? Promise.reject(new Error('network'))
        : Promise.resolve({ status: 200, data: '4.20.0' }),
    );

    await expect(detectApiVersion('https://host')).resolves.toMatchObject({
      apiVersion: 'V4',
      platformVersion: '4.20.0',
    });
  });

  it('rejects an HTML 200 body from the proxy fallback page', async () => {
    get.mockResolvedValue({ status: 200, data: '<!DOCTYPE html><html>ui</html>' });

    await expect(detectApiVersion('https://host')).rejects.toBeInstanceOf(ApiVersionDetectionError);
    expect(get).toHaveBeenCalledTimes(2);
  });

  it('throws when no probe yields a version', async () => {
    get.mockResolvedValue({ status: 404, data: '' });

    await expect(detectApiVersion('https://host')).rejects.toBeInstanceOf(ApiVersionDetectionError);
  });

  it('honours an explicit platformVersion override without probing', async () => {
    const info = await detectApiVersion('https://host', { platformVersion: '4.16.0' });

    expect(info.platformVersion).toBe('4.16.0');
    expect(info.apiVersion).toBe('V4');
    expect(get).not.toHaveBeenCalled();
  });

  it('honours ApiVersion from the http config without probing', async () => {
    const info = await detectApiVersion('https://host', {
      httpConfig: { Services: null, Authentication: null, ApiVersion: '5.2.0' },
    });

    expect(info.apiVersion).toBe('V5');
    expect(info.platformVersion).toBe('5.2.0');
    expect(get).not.toHaveBeenCalled();
  });
});
