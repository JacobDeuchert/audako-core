import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDeprecationInterceptor, DeprecationLogger } from '../../lib/compat/deprecation-logger.js';

function response(headers: any, url = '/api/structure/base/Group/g1', method = 'get') {
  return { headers, config: { url, method }, status: 200, data: {} };
}

describe('DeprecationLogger', () => {
  let logger: DeprecationLogger;
  const sink = vi.fn();

  beforeEach(() => {
    sink.mockReset();
    logger = new DeprecationLogger(sink);
  });

  it('logs a path once', () => {
    expect(logger.log({ path: '/a', method: 'GET' })).toBe(true);
    expect(logger.log({ path: '/a', method: 'GET' })).toBe(false);
    expect(sink).toHaveBeenCalledTimes(1);
    expect(logger.getLoggedPaths()).toEqual(['/a']);
  });

  it('logs different paths separately', () => {
    logger.log({ path: '/a', method: 'GET' });
    logger.log({ path: '/b', method: 'PUT' });
    expect(logger.getLoggedPaths()).toEqual(['/a', '/b']);
  });

  it('forgets everything on reset', () => {
    logger.log({ path: '/a', method: 'GET' });
    logger.reset();
    expect(logger.getLoggedPaths()).toEqual([]);
    expect(logger.log({ path: '/a', method: 'GET' })).toBe(true);
  });
});

describe('createDeprecationInterceptor', () => {
  let logger: DeprecationLogger;
  const sink = vi.fn();

  beforeEach(() => {
    sink.mockReset();
    logger = new DeprecationLogger(sink);
  });

  it('logs once per path when Deprecation: true is present', () => {
    const interceptor = createDeprecationInterceptor(logger);

    interceptor(response({ Deprecation: 'true', Link: '<successor>; rel="successor-version"' }));
    interceptor(response({ deprecation: 'TRUE' }));

    expect(logger.getLoggedPaths()).toEqual(['/api/structure/base/Group/g1']);
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink.mock.calls[0][1]).toMatchObject({
      method: 'GET',
      successor: '<successor>; rel="successor-version"',
    });
  });

  it('ignores the query string when deduplicating', () => {
    const interceptor = createDeprecationInterceptor(logger);

    interceptor(response({ deprecation: 'true' }, '/api/structure/base/Group/query?$filter=a'));
    interceptor(response({ deprecation: 'true' }, '/api/structure/base/Group/query?$filter=b'));

    expect(logger.getLoggedPaths()).toEqual(['/api/structure/base/Group/query']);
  });

  it('does nothing without the header, or with a falsy value', () => {
    const interceptor = createDeprecationInterceptor(logger);

    interceptor(response({}));
    interceptor(response({ Deprecation: 'false' }));
    interceptor(response(undefined));

    expect(logger.getLoggedPaths()).toEqual([]);
  });

  it('reads AxiosHeaders-style header bags', () => {
    const interceptor = createDeprecationInterceptor(logger);
    const headers = { get: (name: string) => (name === 'deprecation' ? 'true' : undefined) };

    interceptor(response(headers, '/api/live/hub'));

    expect(logger.getLoggedPaths()).toEqual(['/api/live/hub']);
  });

  it('returns the response unchanged', () => {
    const interceptor = createDeprecationInterceptor(logger);
    const input = response({ deprecation: 'true' });
    expect(interceptor(input)).toBe(input);
  });
});
