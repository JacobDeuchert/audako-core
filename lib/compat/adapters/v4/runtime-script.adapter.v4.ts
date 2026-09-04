import { ApiVersionInfo } from '../../../api/api-version.js';
import { Field } from '../../../models/entities/configuration-entity.model.js';
import { RuntimeScript } from '../../../models/entities/runtime-script.model.js';
import { canFillFromDefault, EntityAdapter, FromWireMode } from '../entity-adapter.js';

/**
 * v4 adapter for `RuntimeScript`.
 *
 * Plan, "v4 window 4.12 -> 4.23: models": 4.13 added `Enabled`, and documents written before it
 * have no `Enabled` at all, which the server deserializes as `{Value:false}` - i.e. every existing
 * script reads as disabled. Treat undefined/null as `true` on reads below 4.13.
 */
export const runtimeScriptAdapterV4: EntityAdapter<RuntimeScript> = {
  fromWire(wire: any, ctx: ApiVersionInfo, mode?: FromWireMode): RuntimeScript {
    if (!wire || typeof wire !== 'object' || !ctx.isV4) {
      return wire;
    }

    // Below 4.13 `Enabled` does not exist on the wire; the canonical default is `true`. On a
    // projected read an absent `Enabled` was simply not requested, so nothing is invented.
    if (
      !ctx.isAtLeast('4.13') &&
      (wire.Enabled === null || wire.Enabled === undefined) &&
      canFillFromDefault(wire, 'Enabled', mode)
    ) {
      return { ...wire, Enabled: new Field<boolean>(true) } as RuntimeScript;
    }

    return wire as RuntimeScript;
  },

  // Nothing to do on writes: a pre-4.13 platform binds the payload to its own typed model and
  // simply ignores the unknown `Enabled` key, so sending it is lossless in both directions.
  toWire(entity: any): any {
    return entity;
  },
};
