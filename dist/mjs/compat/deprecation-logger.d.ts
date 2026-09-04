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
/** Logs deprecated endpoint usage at most once per path. */
export declare class DeprecationLogger {
    private _loggedPaths;
    private _sink;
    constructor(sink?: DeprecationSink);
    /** Replaces the log sink (useful for wiring app logging or tests). */
    setSink(sink: DeprecationSink): void;
    /** Logs the record unless its path was already logged. Returns true when it was logged. */
    log(record: DeprecationRecord): boolean;
    /** Paths logged so far, in insertion order. */
    getLoggedPaths(): string[];
    /** Forgets all logged paths. */
    reset(): void;
}
/** Process-wide default logger used by {@link createDeprecationInterceptor}. */
export declare const deprecationLogger: DeprecationLogger;
/**
 * Creates an axios response interceptor that logs a warning the first time a given path
 * answers with `Deprecation: true`. Install it with
 * `instance.interceptors.response.use(createDeprecationInterceptor())`.
 */
export declare function createDeprecationInterceptor(logger?: DeprecationLogger): <T>(response: T) => T;
