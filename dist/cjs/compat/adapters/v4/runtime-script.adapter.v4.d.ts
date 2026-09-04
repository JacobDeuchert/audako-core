import { RuntimeScript } from '../../../models/entities/runtime-script.model.js';
import { EntityAdapter } from '../entity-adapter.js';
/**
 * v4 adapter for `RuntimeScript`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.13 added `Enabled`, and documents written before it
 * have no `Enabled` at all, which the server deserializes as `{Value:false}` - i.e. every existing
 * script reads as disabled. Treat undefined/null as `true` on reads below 4.13.
 */
export declare const runtimeScriptAdapterV4: EntityAdapter<RuntimeScript>;
