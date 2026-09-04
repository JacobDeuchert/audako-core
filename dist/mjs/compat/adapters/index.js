import { entityAdapters } from './entity-adapter.js';
import { registerV4Adapters } from './v4/index.js';
export * from './entity-adapter.js';
export * from './v4/index.js';
/**
 * Entry point for the adapter layer. Importing anything from here (in practice `entityAdapters`,
 * which `EntityHttpService` uses) registers the v4 adapters exactly once, as a module side effect.
 *
 * Import graph: `entity-adapter.ts` (registry, no adapter imports) <- `v4/*` <- `v4/index.ts` <-
 * this file. `entity-adapter.ts` must stay free of imports from `v4/`, otherwise registration
 * would depend on module evaluation order.
 */
registerV4Adapters(entityAdapters);
