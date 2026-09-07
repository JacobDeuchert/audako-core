import { deprecationLogger, DeprecationRecord, DeprecationSink } from '../compat/deprecation-logger.js';

export { DeprecationRecord, DeprecationSink };

/**
 * Redirects the deprecation warnings (v5 answering a legacy URL with `Deprecation: true`) into an
 * app's own logging. Every `ApiContext` logs through the same process-wide logger, once per path.
 * Pass `null` to restore the default `console.warn` sink.
 */
export function setDeprecationSink(sink: DeprecationSink | null): void {
  deprecationLogger.setSink(sink);
}

/** Legacy paths seen so far, in the order they were first reported. */
export function getDeprecatedPaths(): string[] {
  return deprecationLogger.getLoggedPaths();
}
