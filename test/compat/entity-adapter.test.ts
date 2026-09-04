import { describe, expect, it } from 'vitest';
import { createApiVersionInfo } from '../../lib/api/api-version.js';
import { EntityType } from '../../lib/models/entities/configuration-entity.model.js';
import {
  AdapterRegistry,
  baseFromWire,
  baseToWire,
  identityAdapter,
  SERVER_OWNED_FIELDS,
} from '../../lib/compat/adapters/entity-adapter.js';
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

describe('AdapterRegistry', () => {
  it('returns the identity adapter for unregistered types', () => {
    const registry = new AdapterRegistry();
    expect(registry.getAdapter(EntityType.Signal)).toBe(identityAdapter);
    expect(registry.has(EntityType.Signal)).toBe(false);
  });

  it('returns a registered adapter and can unregister it again', () => {
    const registry = new AdapterRegistry();
    const adapter = { fromWire: (wire: any) => wire, toWire: (entity: any) => entity };

    registry.register(EntityType.EventCategory, adapter);
    expect(registry.getAdapter(EntityType.EventCategory)).toBe(adapter);

    registry.unregister(EntityType.EventCategory);
    expect(registry.getAdapter(EntityType.EventCategory)).toBe(identityAdapter);
  });

  it('runs baseFromWire before and baseToWire after the per-entity adapter', () => {
    const registry = new AdapterRegistry();
    registry.register(EntityType.Group, {
      fromWire: (wire: any) => ({ ...wire, Marker: 'read' }),
      // The adapter re-adds a server-owned field; baseToWire must still strip it.
      toWire: (entity: any) => ({ ...entity, Marker: 'write', Path: ['leaked'] }),
    });

    const read: any = registry.applyFromWire(EntityType.Group, { Id: 'g1', Name: null }, v4);
    expect(read.Marker).toBe('read');
    expect(read.Name).toEqual(new Group().Name);

    const written: any = registry.applyToWire(EntityType.Group, { Id: 'g1' } as any, v4);
    expect(written.Marker).toBe('write');
    expect(written).not.toHaveProperty('Path');
  });

  it('passes the version info to the adapter', () => {
    const registry = new AdapterRegistry();
    let seen: string = null;
    registry.register(EntityType.Group, {
      fromWire: (wire: any, ctx) => {
        seen = ctx.platformVersion;
        return wire;
      },
      toWire: (entity: any) => entity,
    });

    registry.applyFromWire(EntityType.Group, { Id: 'g1' }, v4);
    expect(seen).toBe('4.23.0');
  });
});
