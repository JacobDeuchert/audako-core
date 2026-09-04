import { describe, expect, it } from 'vitest';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { entityAdapters } from '../../../lib/compat/adapters/index.js';
import {
  CANONICAL_EXPRESSION_PARAMETER_TYPES,
  eventDefinitionAdapterV4,
  LEGACY_EXPRESSION_PARAMETER_TYPES,
} from '../../../lib/compat/adapters/v4/event-definition.adapter.v4.js';
import { loadFixture, v412, v413, v417, v423, v50 } from './fixtures.js';

const wire412 = () => loadFixture('v4/event-definition.4.12.json');
const wire423 = () => loadFixture('v4/event-definition.4.23.json');
const wire50 = () => loadFixture('v5/event-definition.5.0.json');

function types(entity: any): string[] {
  return entity.ExpressionParameters.map((parameter: any) => parameter.Type.Value);
}

describe('eventDefinitionAdapterV4 type value map', () => {
  it('covers every canonical name in the map, both directions', () => {
    for (const legacy of Object.keys(LEGACY_EXPRESSION_PARAMETER_TYPES)) {
      const canonical = LEGACY_EXPRESSION_PARAMETER_TYPES[legacy];
      expect(CANONICAL_EXPRESSION_PARAMETER_TYPES[canonical]).toBe(legacy);
    }
    expect(Object.keys(CANONICAL_EXPRESSION_PARAMETER_TYPES)).toHaveLength(13);
  });

  it('keeps the two irregular mappings', () => {
    expect(LEGACY_EXPRESSION_PARAMETER_TYPES['DataSourceFailureCondition']).toBe('ConnectionFailureConditionSettings');
    expect(LEGACY_EXPRESSION_PARAMETER_TYPES['DataConnectionFailureCondition']).toBe('DataConnectionFailure');
  });
});

describe('eventDefinitionAdapterV4.fromWire', () => {
  it('maps the pre-migrator type names on 4.12', () => {
    const entity: any = eventDefinitionAdapterV4.fromWire(wire412(), v412);
    expect(types(entity)).toEqual([
      'SignalConditionSettings',
      'ConnectionFailureConditionSettings',
      'DataConnectionFailure',
    ]);
  });

  it('leaves the type names alone from 4.13 on', () => {
    const entity: any = eventDefinitionAdapterV4.fromWire(wire412(), v413);
    expect(types(entity)).toEqual(['SignalCondition', 'DataSourceFailureCondition', 'DataConnectionFailureCondition']);
  });

  it('coerces a bare null EventCategoryId to an empty Field below 4.17', () => {
    const entity: any = eventDefinitionAdapterV4.fromWire(wire412(), v412);
    expect(entity.EventCategoryId).toEqual({ Value: null, OOAttributes: [] });
  });

  it('keeps a real EventCategoryId Field on 4.17+', () => {
    const entity: any = eventDefinitionAdapterV4.fromWire(wire423(), v417);
    expect(entity.EventCategoryId.Value).toBe('6501f0000000000000000001');
  });

  it('does not mutate the wire payload', () => {
    const wire = wire412();
    eventDefinitionAdapterV4.fromWire(wire, v412);
    expect(wire.ExpressionParameters[0].Type.Value).toBe('SignalCondition');
    expect(wire.EventCategoryId).toBeNull();
  });

  it('is identity on v5', () => {
    const wire = wire50();
    expect(eventDefinitionAdapterV4.fromWire(wire, v50)).toBe(wire);
  });

  it('is identity on the final v4 release', () => {
    const wire = wire423();
    expect(eventDefinitionAdapterV4.fromWire(wire, v423)).toBe(wire);
  });
});

describe('eventDefinitionAdapterV4.toWire', () => {
  it('writes the pre-migrator type names to a 4.12 platform', () => {
    const payload: any = eventDefinitionAdapterV4.toWire(wire423(), v412);
    expect(types(payload)).toEqual(['SignalCondition', 'DataSourceFailureCondition', 'DataConnectionFailureCondition']);
  });

  it('writes canonical names from 4.13 on and on v5', () => {
    const canonical = wire423();
    expect(eventDefinitionAdapterV4.toWire(canonical, v413)).toBe(canonical);
    expect(eventDefinitionAdapterV4.toWire(canonical, v50)).toBe(canonical);
  });

  it('round-trips through a 4.12 platform', () => {
    const canonical: any = eventDefinitionAdapterV4.fromWire(wire412(), v412);
    const payload = eventDefinitionAdapterV4.toWire(canonical, v412);
    expect(eventDefinitionAdapterV4.fromWire(payload, v412)).toEqual(canonical);
  });
});

describe('EventDefinition through the registry', () => {
  it('applies the base default pass and the adapter', () => {
    const entity: any = entityAdapters.applyFromWire(EntityType.EventDefinition, wire412(), v412);
    expect(types(entity)[0]).toBe('SignalConditionSettings');
    // filled by baseFromWire, absent on 4.12
    expect(entity.Tags).toEqual({ Value: [], OOAttributes: [] });
  });

  it('strips the server-owned fields on write', () => {
    const payload: any = entityAdapters.applyToWire(EntityType.EventDefinition, wire50(), v412);
    expect(payload).not.toHaveProperty('Path');
    expect(types(payload)[0]).toBe('SignalCondition');
  });
});
