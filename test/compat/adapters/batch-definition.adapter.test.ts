import { describe, expect, it } from 'vitest';
import { entityAdapters } from '../../../lib/compat/adapters/index.js';
import { batchDefinitionAdapterV4 } from '../../../lib/compat/adapters/v4/batch-definition.adapter.v4.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v416, v417, v423, v50 } from './fixtures.js';

const wire412 = () => loadFixture('v4/batch-definition.4.12.json');
const wire423 = () => loadFixture('v4/batch-definition.4.23.json');
const wire50 = () => loadFixture('v5/batch-definition.5.0.json');

describe('batchDefinitionAdapterV4.fromWire', () => {
  it('derives MetadataField.Editable from ObligatoryAt == Stop below 4.17', () => {
    const entity: any = batchDefinitionAdapterV4.fromWire(wire412(), v416);
    expect(entity.MetadataFields['chargeNr'].Editable).toBe(true);
    expect(entity.MetadataFields['operator'].Editable).toBe(false);
  });

  it('leaves non-manual fields not editable, like BatchDefinitionMigrator_V1', () => {
    // counter: Source = Signal, ObligatoryAt = Stop -> the migrator skips it
    const entity: any = batchDefinitionAdapterV4.fromWire(wire412(), v412);
    expect(entity.MetadataFields['counter'].Editable).toBe(false);
  });

  it('produces the same Editable values as the 4.23 payload carries', () => {
    const derived: any = batchDefinitionAdapterV4.fromWire(wire412(), v412);
    const migrated: any = wire423();
    for (const key of Object.keys(migrated.MetadataFields)) {
      expect(derived.MetadataFields[key].Editable, key).toBe(migrated.MetadataFields[key].Editable);
    }
  });

  it('does not touch an Editable the server already sent', () => {
    const wire = wire412();
    wire.MetadataFields['chargeNr'].Editable = false;
    const entity: any = batchDefinitionAdapterV4.fromWire(wire, v412);
    expect(entity.MetadataFields['chargeNr'].Editable).toBe(false);
  });

  it('is identity from 4.17 on and on v5', () => {
    const v4Wire = wire423();
    expect(batchDefinitionAdapterV4.fromWire(v4Wire, v417)).toBe(v4Wire);
    expect(batchDefinitionAdapterV4.fromWire(v4Wire, v423)).toBe(v4Wire);
    const v5Wire = wire50();
    expect(batchDefinitionAdapterV4.fromWire(v5Wire, v50)).toBe(v5Wire);
  });

  it('does not mutate the wire payload', () => {
    const wire = wire412();
    batchDefinitionAdapterV4.fromWire(wire, v412);
    expect(wire.MetadataFields['chargeNr']).not.toHaveProperty('Editable');
  });
});

describe('batchDefinitionAdapterV4.toWire', () => {
  it('is identity on every version', () => {
    const canonical = wire423();
    expect(batchDefinitionAdapterV4.toWire(canonical, v412)).toBe(canonical);
    expect(batchDefinitionAdapterV4.toWire(canonical, v50)).toBe(canonical);
  });

  it('round-trips through a 4.12 platform', () => {
    const canonical: any = batchDefinitionAdapterV4.fromWire(wire412(), v412);
    const payload = batchDefinitionAdapterV4.toWire(canonical, v412);
    expect(batchDefinitionAdapterV4.fromWire(payload, v412)).toEqual(canonical);
  });
});

describe('BatchDefinition through the registry', () => {
  it('fills the nested settings objects a 4.12 platform lacks', () => {
    const entity: any = entityAdapters.applyFromWire(EntityType.BatchDefinition, wire412(), v412);
    expect(entity.MetadataFields['chargeNr'].Editable).toBe(true);
    expect(entity.ReleaseSettings).toEqual({ Enabled: false, SignalId: null, ReleaseValue: null });
    expect(entity.BatchReviewSettings).toEqual({ Enabled: false, Reviews: [], Ordered: false });
  });
});
