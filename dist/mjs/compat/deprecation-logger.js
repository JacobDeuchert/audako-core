/**
 * v5 answers every request that came in through a legacy (pre-`/api/v1`) URL with
 * `Deprecation: true` and a `Link: <successor>; rel="successor-version"` header. Logging those
 * once per path gives a live list of audako-core call sites that are still on legacy URLs.
 */
const defaultSink = (message) => console.warn(message);
/** Logs deprecated endpoint usage at most once per path. */
export class DeprecationLogger {
    constructor(sink = defaultSink) {
        this._loggedPaths = new Set();
        this._sink = sink;
    }
    /** Replaces the log sink (useful for wiring app logging or tests). */
    setSink(sink) {
        this._sink = sink || defaultSink;
    }
    /** Logs the record unless its path was already logged. Returns true when it was logged. */
    log(record) {
        if (this._loggedPaths.has(record.path)) {
            return false;
        }
        this._loggedPaths.add(record.path);
        this._sink(`[audako-core] Deprecated platform endpoint: ${record.method} ${record.path}${record.successor ? ` (successor: ${record.successor})` : ''}`, record);
        return true;
    }
    /** Paths logged so far, in insertion order. */
    getLoggedPaths() {
        return Array.from(this._loggedPaths);
    }
    /** Forgets all logged paths. */
    reset() {
        this._loggedPaths.clear();
    }
}
/** Process-wide default logger used by {@link createDeprecationInterceptor}. */
export const deprecationLogger = new DeprecationLogger();
function headerValue(headers, name) {
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
function pathOf(url) {
    return (url || '').split('?')[0];
}
/**
 * Creates an axios response interceptor that logs a warning the first time a given path
 * answers with `Deprecation: true`. Install it with
 * `instance.interceptors.response.use(createDeprecationInterceptor())`.
 */
export function createDeprecationInterceptor(logger = deprecationLogger) {
    return function deprecationInterceptor(response) {
        var _a, _b;
        const anyResponse = response;
        const deprecation = headerValue(anyResponse === null || anyResponse === void 0 ? void 0 : anyResponse.headers, 'deprecation');
        if (deprecation && deprecation.toLowerCase() === 'true') {
            logger.log({
                path: pathOf((_a = anyResponse === null || anyResponse === void 0 ? void 0 : anyResponse.config) === null || _a === void 0 ? void 0 : _a.url),
                method: (((_b = anyResponse === null || anyResponse === void 0 ? void 0 : anyResponse.config) === null || _b === void 0 ? void 0 : _b.method) || 'GET').toUpperCase(),
                successor: headerValue(anyResponse === null || anyResponse === void 0 ? void 0 : anyResponse.headers, 'link'),
            });
        }
        return response;
    };
}
