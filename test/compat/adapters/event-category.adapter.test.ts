import { describe, expect, it } from 'vitest';
import { applyFromWire, applyToWire } from '../../../lib/compat/adapters/index.js';
import { eventCategoryAdapterV4 } from '../../../lib/compat/adapters/v4/event-category.adapter.v4.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v422, v423, v50 } from './fixtures.js';

const wire412 = () => loadFixture('v4/event-category.4.12.json');
const wire423 = () => loadFixture('v4/event-category.4.23.json');
const wire50 = () => loadFixture('v5/event-category.5.0.json');

describe('eventCategoryAdapterV4.fromWire', () => {
  it('reads the legacy Acknowledgment key as RequiresAcknowledgment below 4.23', () => {
    const entity: any = eventCategoryAdapterV4.fromWire(wire412(), v412);
    expect(entity.RequiresAcknowledgment).toEqual({ Value: true, OOAttributes: [] });
    expect(entity).not.toHaveProperty('Acknowledgment');
  });

  it('wins over the model default the base pass filled in', () => {
    const wire = wire412();
    wire.Acknowledgment.Value = false;
    // baseFromWire fills RequiresAcknowledgment = Field(true) from the 4.23 model default; the
    // legacy key must still win, otherwise a category read from 4.12 silently flips to true.
    const entity: any = applyFromWire(EntityType.EventCategory, wire, v412);
    expect(entity.RequiresAcknowledgment.Value).toBe(false);
    expect(entity).not.toHaveProperty('Acknowledgment');
  });

  it('keeps RequiresAcknowledgment on 4.23 and drops a stale legacy key', () => {
    const wire = wire423();
    wire.Acknowledgment = { Value: false, OOAttributes: [] };
    const entity: any = eventCategoryAdapterV4.fromWire(wire, v423);
    expect(entity.RequiresAcknowledgment.Value).toBe(true);
    expect(entity).not.toHaveProperty('Acknowledgment');
  });

  it('is identity on v5, where Acknowledgment is a field of its own', () => {
    const wire = wire50();
    const entity: any = eventCategoryAdapterV4.fromWire(wire, v50);
    expect(entity).toBe(wire);
    expect(entity.Acknowledgment).toEqual({ Value: false, OOAttributes: [] });
    expect(entity.RequiresAcknowledgment.Value).toBe(true);
  });

  it('does not mutate the wire payload', () => {
    const wire = wire412();
    eventCategoryAdapterV4.fromWire(wire, v412);
    expect(wire.Acknowledgment).toEqual({ Value: true, OOAttributes: [] });
  });
});

describe('eventCategoryAdapterV4.toWire', () => {
  it('writes the legacy name below 4.23, taken from RequiresAcknowledgment', () => {
    const canonical: any = wire50();
    canonical.RequiresAcknowledgment = { Value: false, OOAttributes: [] };
    canonical.Acknowledgment = { Value: true, OOAttributes: [] }; // the v5-only field

    const payload: any = eventCategoryAdapterV4.toWire(canonical, v422);
    expect(payload.Acknowledgment).toEqual({ Value: false, OOAttributes: [] });
    expect(payload.RequiresAcknowledgment).toEqual({ Value: false, OOAttributes: [] });
  });

  it('strips the v5-only field from 4.23 writes', () => {
    const payload: any = eventCategoryAdapterV4.toWire(wire50(), v423);
    expect(payload).not.toHaveProperty('Acknowledgment');
    expect(payload.RequiresAcknowledgment.Value).toBe(true);
  });

  it('is identity on v5', () => {
    const canonical = wire50();
    expect(eventCategoryAdapterV4.toWire(canonical, v50)).toBe(canonical);
  });

  it('round-trips through a 4.12 platform', () => {
    const canonical: any = eventCategoryAdapterV4.fromWire(wire412(), v412);
    const payload = eventCategoryAdapterV4.toWire(canonical, v412);
    expect(eventCategoryAdapterV4.fromWire(payload, v412)).toEqual(canonical);
  });

  it('round-trips a v5 payload through the adapter map on v5', () => {
    const canonical: any = applyFromWire(EntityType.EventCategory, wire50(), v50);
    const payload: any = applyToWire(EntityType.EventCategory, canonical, v50);
    expect(payload.Acknowledgment).toEqual({ Value: false, OOAttributes: [] });
    expect(payload).not.toHaveProperty('Path');
  });
});
