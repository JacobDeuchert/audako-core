import { describe, expect, it } from 'vitest';
import { applyFromWire } from '../../../lib/compat/adapters/index.js';
import { dashboardTabAdapterV4 } from '../../../lib/compat/adapters/v4/dashboard-tab.adapter.v4.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v415, v423, v50 } from './fixtures.js';

const wire412 = () => loadFixture('v4/dashboard-tab.4.12.json');
const wireLegacyId = () => loadFixture('v4/dashboard-tab.4.15-legacy-id.json');
const wire423 = () => loadFixture('v4/dashboard-tab.4.23.json');
const wire50 = () => loadFixture('v5/dashboard-tab.5.0.json');

describe('dashboardTabAdapterV4.fromWire', () => {
  it('reads the pre-rename DashboardTabEntity.Id as EntityId', () => {
    const entity: any = dashboardTabAdapterV4.fromWire(wireLegacyId(), v415);
    expect(entity.EntityMappings.Value).toEqual({
      'signal-a': { Type: 'Signal', EntityId: '6501f0000000000000000051' },
      'group-b': { Type: 'Group', EntityId: '6501f0000000000000000052' },
    });
  });

  it('reads the legacy spelling on the final v4 release too, since documents were never migrated', () => {
    const entity: any = dashboardTabAdapterV4.fromWire(wireLegacyId(), v423);
    expect(entity.EntityMappings.Value['signal-a'].EntityId).toBe('6501f0000000000000000051');
  });

  it('leaves the short-lived EntityMapping dictionary untouched', () => {
    const entity: any = dashboardTabAdapterV4.fromWire(wireLegacyId(), v415);
    expect(entity.EntityMapping).toEqual({ 'signal-a': '6501f0000000000000000051' });
    expect(Object.keys(entity.EntityMappings.Value)).toEqual(['signal-a', 'group-b']);
  });

  it('is identity when the mappings already use EntityId', () => {
    const wire = wire423();
    expect(dashboardTabAdapterV4.fromWire(wire, v423)).toBe(wire);
  });

  it('is identity when there are no mappings at all', () => {
    const wire = wire412();
    expect(dashboardTabAdapterV4.fromWire(wire, v412)).toBe(wire);
  });

  it('is identity on v5', () => {
    const wire = wire50();
    expect(dashboardTabAdapterV4.fromWire(wire, v50)).toBe(wire);
  });

  it('does not mutate the wire payload', () => {
    const wire = wireLegacyId();
    dashboardTabAdapterV4.fromWire(wire, v415);
    expect(wire.EntityMappings.Value['signal-a']).toEqual({ Id: '6501f0000000000000000051', Type: 'Signal' });
  });
});

describe('dashboardTabAdapterV4.toWire', () => {
  it('writes EntityId, never Id', () => {
    const canonical: any = dashboardTabAdapterV4.fromWire(wireLegacyId(), v415);
    const payload: any = dashboardTabAdapterV4.toWire(canonical, v415);
    for (const mapping of Object.values<any>(payload.EntityMappings.Value)) {
      expect(mapping).not.toHaveProperty('Id');
      expect(typeof mapping.EntityId).toBe('string');
    }
  });

  it('drops a stray Id that survived a read', () => {
    const canonical: any = wire423();
    canonical.EntityMappings.Value['signal-a'] = { Id: 'stale', Type: 'Signal', EntityId: 'real' };
    const payload: any = dashboardTabAdapterV4.toWire(canonical, v423);
    expect(payload.EntityMappings.Value['signal-a']).toEqual({ Type: 'Signal', EntityId: 'real' });
  });

  it('is identity on v5', () => {
    const canonical = wire50();
    expect(dashboardTabAdapterV4.toWire(canonical, v50)).toBe(canonical);
  });

  it('round-trips a legacy document', () => {
    const canonical: any = dashboardTabAdapterV4.fromWire(wireLegacyId(), v415);
    const payload = dashboardTabAdapterV4.toWire(canonical, v415);
    expect(dashboardTabAdapterV4.fromWire(payload, v415)).toEqual(canonical);
  });
});

describe('DashboardTab through the adapter map', () => {
  it('fills the fields a 4.12 platform does not have yet', () => {
    const entity: any = applyFromWire(EntityType.DashboardTab, wire412(), v412);
    expect(entity.EntityMappings).toEqual({ Value: null, OOAttributes: [] });
    expect(entity.PlaceholderValues).toEqual({ Value: null, OOAttributes: [] });
  });
});
