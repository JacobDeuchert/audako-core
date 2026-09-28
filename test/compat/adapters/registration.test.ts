import { describe, expect, it } from 'vitest';
import { identityAdapter } from '../../../lib/compat/adapters/entity-adapter.js';
import {
  applyFromWire,
  applyToWire,
  ENTITY_ADAPTERS,
  getEntityAdapter,
  V4_ADAPTED_ENTITY_TYPES,
  V4_ADAPTERS,
} from '../../../lib/compat/adapters/index.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v50 } from './fixtures.js';

describe('v4 adapter map', () => {
  it('lists every adapted entity type', () => {
    for (const entityType of V4_ADAPTED_ENTITY_TYPES) {
      expect(ENTITY_ADAPTERS[entityType], entityType).toBe(V4_ADAPTERS[entityType]);
      expect(getEntityAdapter(entityType), entityType).not.toBe(identityAdapter);
    }
    expect(V4_ADAPTED_ENTITY_TYPES.length).toBe(12);
  });

  it('leaves every other entity type on the identity adapter', () => {
    const untouched = (Object.keys(EntityType) as EntityType[]).filter(
      (entityType) => V4_ADAPTED_ENTITY_TYPES.indexOf(entityType) < 0,
    );
    expect(untouched.length).toBeGreaterThan(0);
    for (const entityType of untouched) {
      expect(getEntityAdapter(entityType), entityType).toBe(identityAdapter);
    }
  });

  it('is frozen', () => {
    expect(Object.isFrozen(ENTITY_ADAPTERS)).toBe(true);
    expect(Object.isFrozen(V4_ADAPTERS)).toBe(true);
  });
});

describe('listed adapters on v5', () => {
  const fixtures: [EntityType, string][] = [
    [EntityType.BatchDefinition, 'v5/batch-definition.5.0.json'],
    [EntityType.DashboardTab, 'v5/dashboard-tab.5.0.json'],
    [EntityType.EventCategory, 'v5/event-category.5.0.json'],
    [EntityType.EventDefinition, 'v5/event-definition.5.0.json'],
    [EntityType.Group, 'v5/group.5.0.json'],
    [EntityType.RuntimeScript, 'v5/runtime-script.5.0.json'],
  ];

  it.each(fixtures)('%s is identity on reads', (entityType, fixture) => {
    const wire = loadFixture(fixture);
    expect(getEntityAdapter(entityType).fromWire(wire, v50)).toBe(wire);
  });

  it.each(fixtures)('%s only loses the server-owned fields on writes', (entityType, fixture) => {
    const canonical: any = loadFixture(fixture);
    const payload: any = applyToWire(entityType, canonical, v50);
    const { Path, ...expected } = canonical;
    expect(payload).toEqual(expected);
  });

  it.each(fixtures)('%s stays stable across a v4 read/write/read cycle', (entityType, fixture) => {
    const canonical: any = applyFromWire(entityType, loadFixture(fixture), v412);
    const payload = applyToWire(entityType, canonical, v412);
    const reread: any = applyFromWire(entityType, payload, v412);
    const secondPayload = applyToWire(entityType, reread, v412);
    expect(secondPayload).toEqual(payload);
  });
});
