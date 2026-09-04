import { describe, expect, it } from 'vitest';
import { AdapterRegistry, identityAdapter } from '../../../lib/compat/adapters/entity-adapter.js';
import { entityAdapters, registerV4Adapters, V4_ADAPTED_ENTITY_TYPES } from '../../../lib/compat/adapters/index.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v50 } from './fixtures.js';

describe('v4 adapter registration', () => {
  it('registers every adapted entity type by importing the adapters index', () => {
    for (const entityType of V4_ADAPTED_ENTITY_TYPES) {
      expect(entityAdapters.has(entityType), entityType).toBe(true);
    }
  });

  it('leaves every other entity type on the identity adapter', () => {
    const untouched = (Object.keys(EntityType) as EntityType[]).filter(
      (entityType) => V4_ADAPTED_ENTITY_TYPES.indexOf(entityType) < 0,
    );
    expect(untouched.length).toBeGreaterThan(0);
    for (const entityType of untouched) {
      expect(entityAdapters.getAdapter(entityType), entityType).toBe(identityAdapter);
    }
  });

  it('can register into a separate registry', () => {
    const registry = registerV4Adapters(new AdapterRegistry());
    expect(registry.has(EntityType.EventCategory)).toBe(true);
    expect(registry.getAdapter(EntityType.EventCategory)).toBe(entityAdapters.getAdapter(EntityType.EventCategory));
  });

  it('is idempotent', () => {
    const before = entityAdapters.getAdapter(EntityType.EventDefinition);
    registerV4Adapters();
    expect(entityAdapters.getAdapter(EntityType.EventDefinition)).toBe(before);
  });
});

describe('registered adapters on v5', () => {
  const fixtures: [EntityType, string][] = [
    [EntityType.BatchDefinition, 'v5/batch-definition.5.0.json'],
    [EntityType.DashboardTab, 'v5/dashboard-tab.5.0.json'],
    [EntityType.EventCategory, 'v5/event-category.5.0.json'],
    [EntityType.EventDefinition, 'v5/event-definition.5.0.json'],
    [EntityType.RuntimeScript, 'v5/runtime-script.5.0.json'],
  ];

  it.each(fixtures)('%s is identity on reads', (entityType, fixture) => {
    const wire = loadFixture(fixture);
    expect(entityAdapters.getAdapter(entityType).fromWire(wire, v50)).toBe(wire);
  });

  it.each(fixtures)('%s only loses the server-owned fields on writes', (entityType, fixture) => {
    const canonical: any = loadFixture(fixture);
    const payload: any = entityAdapters.applyToWire(entityType, canonical, v50);
    const { Path, ...expected } = canonical;
    expect(payload).toEqual(expected);
  });

  it.each(fixtures)('%s stays stable across a v4 read/write/read cycle', (entityType, fixture) => {
    const canonical: any = entityAdapters.applyFromWire(entityType, loadFixture(fixture), v412);
    const payload = entityAdapters.applyToWire(entityType, canonical, v412);
    const reread: any = entityAdapters.applyFromWire(entityType, payload, v412);
    const secondPayload = entityAdapters.applyToWire(entityType, reread, v412);
    expect(secondPayload).toEqual(payload);
  });
});
