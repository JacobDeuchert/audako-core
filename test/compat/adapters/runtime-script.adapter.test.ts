import { describe, expect, it } from 'vitest';
import { entityAdapters } from '../../../lib/compat/adapters/index.js';
import { runtimeScriptAdapterV4 } from '../../../lib/compat/adapters/v4/runtime-script.adapter.v4.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v413, v423, v50 } from './fixtures.js';

const wire412 = () => loadFixture('v4/runtime-script.4.12.json');
const wire423 = () => loadFixture('v4/runtime-script.4.23.json');
const wire50 = () => loadFixture('v5/runtime-script.5.0.json');

describe('runtimeScriptAdapterV4.fromWire', () => {
  it('treats an absent Enabled as true below 4.13', () => {
    const entity: any = runtimeScriptAdapterV4.fromWire(wire412(), v412);
    expect(entity.Enabled).toEqual({ Value: true, OOAttributes: [] });
  });

  it('keeps an explicit Enabled from 4.13 on', () => {
    const entity: any = runtimeScriptAdapterV4.fromWire(wire423(), v413);
    expect(entity.Enabled.Value).toBe(false);
  });

  it('does not invent Enabled from 4.13 on', () => {
    const wire = wire412();
    const entity: any = runtimeScriptAdapterV4.fromWire(wire, v413);
    expect(entity).toBe(wire);
    expect(entity).not.toHaveProperty('Enabled');
  });

  it('is identity on 4.23 and v5', () => {
    const v4Wire = wire423();
    expect(runtimeScriptAdapterV4.fromWire(v4Wire, v423)).toBe(v4Wire);
    const v5Wire = wire50();
    expect(runtimeScriptAdapterV4.fromWire(v5Wire, v50)).toBe(v5Wire);
  });

  it('does not mutate the wire payload', () => {
    const wire = wire412();
    runtimeScriptAdapterV4.fromWire(wire, v412);
    expect(wire).not.toHaveProperty('Enabled');
  });
});

describe('runtimeScriptAdapterV4.toWire', () => {
  it('is identity on every version', () => {
    const canonical = wire423();
    expect(runtimeScriptAdapterV4.toWire(canonical, v412)).toBe(canonical);
    expect(runtimeScriptAdapterV4.toWire(canonical, v50)).toBe(canonical);
  });

  it('round-trips through a 4.12 platform', () => {
    const canonical: any = runtimeScriptAdapterV4.fromWire(wire412(), v412);
    const payload = runtimeScriptAdapterV4.toWire(canonical, v412);
    expect(runtimeScriptAdapterV4.fromWire(payload, v412)).toEqual(canonical);
  });
});

describe('RuntimeScript through the registry', () => {
  it('reads a 4.12 script as enabled', () => {
    const entity: any = entityAdapters.applyFromWire(EntityType.RuntimeScript, wire412(), v412);
    expect(entity.Enabled.Value).toBe(true);
  });

  it('keeps a disabled 4.23 script disabled', () => {
    const entity: any = entityAdapters.applyFromWire(EntityType.RuntimeScript, wire423(), v423);
    expect(entity.Enabled.Value).toBe(false);
  });
});
