/**
 * v5 answers every request that came in through a legacy (pre-`/api/v1`) URL with
 * `Deprecation: true` and a `Link: <successor>; rel="successor-version"` header. Logging those
 * once per path gives a live list of audako-core call sites that are still on legacy URLs.
 */

/** Sink the logger writes to. Defaults to `console.warn`. */
export type DeprecationSink = (message: string, details: DeprecationRecord) => void;

export interface DeprecationRecord {
  /** Request path (URL without query string). */
  path: string;
  /** HTTP method of the deprecated request. */
  method: string;
  /** Value of the `Link` header, when the platform sent a successor. */
  successor?: string;
}

const defaultSink: DeprecationSink = (message) => console.warn(message);

/** Logs deprecated endpoint usage at most once per path. */
export class DeprecationLogger {
  private _loggedPaths = new Set<string>();
  private _sink: DeprecationSink;

  constructor(sink: DeprecationSink = defaultSink) {
    this._sink = sink;
  }

  /** Replaces the log sink (useful for wiring app logging or tests). */
  public setSink(sink: DeprecationSink): void {
    this._sink = sink || defaultSink;
  }

  /** Logs the record unless its path was already logged. Returns true when it was logged. */
  public log(record: DeprecationRecord): boolean {
    if (this._loggedPaths.has(record.path)) {
      return false;
    }

    this._loggedPaths.add(record.path);
    this._sink(
      `[audako-core] Deprecated platform endpoint: ${record.method} ${record.path}${
        record.successor ? ` (successor: ${record.successor})` : ''
      }`,
      record,
    );
    return true;
  }

  /** Paths logged so far, in insertion order. */
  public getLoggedPaths(): string[] {
    return Array.from(this._loggedPaths);
  }

  /** Forgets all logged paths. */
  public reset(): void {
    this._loggedPaths.clear();
  }
}

/** Process-wide default logger used by {@link createDeprecationInterceptor}. */
export const deprecationLogger = new DeprecationLogger();

function headerValue(headers: any, name: string): string | undefined {
  if (!headers) {
    return undefined;
  }
  if (typeof headers.get === 'function') {
    const value = headers.get(name);
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }
  const lower = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === lower) {
      const value = headers[key];
      return value === undefined || value === null ? undefined : String(value);
    }
  }
  return undefined;
}

/** Strips the query string from a URL so one path is logged once regardless of parameters. */
function pathOf(url: string): string {
  return (url || '').split('?')[0];
}

/**
 * Creates an axios response interceptor that logs a warning the first time a given path
 * answers with `Deprecation: true`. Install it with
 * `instance.interceptors.response.use(createDeprecationInterceptor())`.
 */
export function createDeprecationInterceptor(logger: DeprecationLogger = deprecationLogger): <T>(response: T) => T {
  return function deprecationInterceptor<T>(response: T): T {
    const anyResponse = response as any;
    const deprecation = headerValue(anyResponse?.headers, 'deprecation');

    if (deprecation && deprecation.toLowerCase() === 'true') {
      logger.log({
        path: pathOf(anyResponse?.config?.url),
        method: (anyResponse?.config?.method || 'GET').toUpperCase(),
        successor: headerValue(anyResponse?.headers, 'link'),
      });
    }

    return response;
  };
}
