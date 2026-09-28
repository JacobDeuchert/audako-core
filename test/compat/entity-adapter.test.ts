import { describe, expect, it, vi } from 'vitest';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import {
  baseFromWire,
  baseToWire,
  identityAdapter,
  NEVER_FILLED_FIELDS,
  SERVER_OWNED_FIELDS,
} from '../../lib/compat/adapters/entity-adapter.js';
import { applyFromWire, applyToWire, getEntityAdapter } from '../../lib/compat/adapters/index.js';
import { eventDefinitionAdapterV4 } from '../../lib/compat/adapters/v4/event-definition.adapter.v4.js';
import { Group } from '../../lib/models/entities/group.model.js';

const v4 = createApiVersionInfo('4.23.0');

describe('baseToWire', () => {
  it('strips the server-owned fields', () => {
    const payload = baseToWire({
      Id: 'g1',
      Name: { Value: 'Group' },
      Path: ['a', 'b'],
      AclAllow: ['x'],
      AclDeny: ['y'],
    });

    for (const field of SERVER_OWNED_FIELDS) {
      expect(payload).not.toHaveProperty(field);
    }
    expect(payload.Id).toBe('g1');
  });

  it('does not mutate the input', () => {
    const entity: any = { Id: 'g1', Path: ['a'] };
    baseToWire(entity);
    expect(entity.Path).toEqual(['a']);
  });

  it('passes non-objects through', () => {
    expect(baseToWire(null)).toBeNull();
    expect(baseToWire('x' as any)).toBe('x');
  });
});

describe('baseFromWire', () => {
  it('fills constructor defaults for present-but-null fields', () => {
    const defaults = new Group();
    const entity: any = baseFromWire({ Id: 'g1', Name: null, Tags: null }, EntityType.Group);

    expect(entity.Id).toBe('g1');
    expect(entity.Name).toEqual(defaults.Name);
    expect(entity.Tags).toEqual(defaults.Tags);
  });

  it('fills defaults for absent fields as well', () => {
    const entity: any = baseFromWire({ Id: 'g1' }, EntityType.Group);
    expect(entity.Name).toEqual(new Group().Name);
  });

  it('keeps wire values that are present', () => {
    const entity: any = baseFromWire({ Id: 'g1', Name: { Value: 'from wire', OOAttributes: [] } }, EntityType.Group);
    expect(entity.Name.Value).toBe('from wire');
  });

  it('keeps a null when the model default is null too', () => {
    const defaults: any = new Group();
    const nullDefaultKeys = Object.keys(defaults).filter((key) => defaults[key] === null);
    const entity: any = baseFromWire(
      nullDefaultKeys.reduce((wire: any, key) => ({ ...wire, [key]: null }), { Id: 'g1' }),
      EntityType.Group,
    );
    for (const key of nullDefaultKeys) {
      expect(entity[key], key).toBeNull();
    }
  });

  it('passes non-objects and arrays through', () => {
    expect(baseFromWire(null, EntityType.Group)).toBeNull();
    expect(baseFromWire([1, 2], EntityType.Group)).toEqual([1, 2]);
  });
});

describe('adapter map', () => {
  it('returns the identity adapter for unlisted types', () => {
    expect(getEntityAdapter(EntityType.DataSource)).toBe(identityAdapter);
  });

  it('runs baseFromWire before and baseToWire after the per-entity adapter', () => {
    // EventCategory has a v4 adapter; on v5 it is identity, so only the base passes act.
    const v5 = createApiVersionInfo('5.0.0');
    const read: any = applyFromWire(EntityType.EventCategory, { Id: 'c1', Name: null }, v5);
    expect(read.Name).toEqual(new Group().Name);

    const written: any = applyToWire(EntityType.EventCategory, { Id: 'c1', Path: ['leaked'] } as any, v5);
    expect(written).not.toHaveProperty('Path');
  });

  it('never fills identity or audit fields from the model defaults', () => {
    const entity: any = baseFromWire({ Name: { Value: 'g' }, CreatedOn: null, CreatedBy: null }, EntityType.Group);

    expect(entity.Id).toBeUndefined();
    expect(entity.CreatedOn).toBeNull();
    expect(entity.CreatedBy).toBeNull();
    expect(NEVER_FILLED_FIELDS).toContain('CreatedOn');
  });

  it('does not default CreatedOn on the model either', () => {
    expect(new Group().CreatedOn).toBeNull();
  });
});

describe('baseFromWire projected mode', () => {
  it('does not fabricate absent fields on a projected read', () => {
    const entity: any = baseFromWire({ Id: 'g1', Name: { Value: 'g' } }, EntityType.Group, 'projected');

    expect(Object.keys(entity).sort()).toEqual(['Id', 'Name']);
    expect(entity).not.toHaveProperty('Tags');
  });

  it('still treats a present-but-null field as absent on a projected read', () => {
    const entity: any = baseFromWire({ Id: 'g1', Tags: null }, EntityType.Group, 'projected');
    expect(entity.Tags).toEqual(new Group().Tags);
  });

  it('keeps falsy wire values in both modes', () => {
    for (const mode of ['full', 'projected'] as const) {
      const entity: any = baseFromWire(
        { Id: '', Name: { Value: '', OOAttributes: [] }, Tags: [], Deleted: false, Version: 0 },
        EntityType.Group,
        mode,
      );

      expect(entity.Id).toBe('');
      expect(entity.Name.Value).toBe('');
      expect(entity.Tags).toEqual([]);
      expect(entity.Deleted).toBe(false);
      expect(entity.Version).toBe(0);
    }
  });

  it('fills nested settings defaults of a sub-object that is present on a projected read', () => {
    const wire = { Id: 'g1', Name: { Value: 'g' } };

    // Sanity: the same payload read in full mode does get the remaining defaults.
    const full: any = applyFromWire(EntityType.Group, wire, v4);
    const projected: any = applyFromWire(EntityType.Group, wire, v4, 'projected');

    expect(Object.keys(full).length).toBeGreaterThan(Object.keys(projected).length);
    expect(Object.keys(projected).sort()).toEqual(['Id', 'Name']);
  });

  it('passes the mode on to the per-entity adapter', () => {
    const fromWire = vi.spyOn(eventDefinitionAdapterV4, 'fromWire');
    try {
      applyFromWire(EntityType.EventDefinition, { Id: 'e1' }, v4);
      applyFromWire(EntityType.EventDefinition, { Id: 'e1' }, v4, 'projected');
      expect(fromWire.mock.calls.map((call) => call[2])).toEqual(['full', 'projected']);
    } finally {
      fromWire.mockRestore();
    }
  });
});
