import { describe, expect, it } from 'vitest';
import { applyFromWire, applyToWire } from '../../../lib/compat/adapters/index.js';
import {
  boolCodec,
  hexColorCodec,
  idCodec,
  nullableIntCodec,
  positionCodec,
  scalingCalculatorStateCodec,
  textCodec,
} from '../../../lib/compat/adapters/v4/additional-fields.v4.js';
import { eventCategoryAdapterV4 } from '../../../lib/compat/adapters/v4/event-category.adapter.v4.js';
import { eventDefinitionAdapterV4 } from '../../../lib/compat/adapters/v4/event-definition.adapter.v4.js';
import { groupAdapterV4 } from '../../../lib/compat/adapters/v4/group.adapter.v4.js';
import { signalAdapterV4 } from '../../../lib/compat/adapters/v4/signal.adapter.v4.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { loadFixture, v412, v423, v50 } from './fixtures.js';

const group423 = () => loadFixture('v4/group.4.23.json');
const group50 = () => loadFixture('v5/group.5.0.json');
const counter423 = () => loadFixture('v4/signal-counter.4.23.json');
const analog423 = () => loadFixture('v4/signal-analog.4.23.json');
const analog50 = () => loadFixture('v5/signal-analog.5.0.json');

const field = (Value: any, OOAttributes: any[] = []) => ({ Value, OOAttributes });

describe('legacy key codecs', () => {
  it('parse like the v5 migrator parsers', () => {
    expect(boolCodec.parse(' TRUE ')).toEqual({ value: true });
    expect(boolCodec.parse('false')).toEqual({ value: false });
    expect(boolCodec.parse('')).toBeUndefined();
    expect(boolCodec.parse('yes')).toBeUndefined();

    expect(nullableIntCodec.parse(' 3 ')).toEqual({ value: 3 });
    expect(nullableIntCodec.parse('')).toEqual({ value: null });
    expect(nullableIntCodec.parse('1.5')).toBeUndefined();

    expect(hexColorCodec.parse('#FF8800')).toEqual({ value: '#ff8800' });
    expect(hexColorCodec.parse('#ff880080')).toEqual({ value: '#ff880080' });
    expect(hexColorCodec.parse('red')).toBeUndefined();

    expect(textCodec(3).parse('abcd')).toBeUndefined();
    expect(textCodec(3).parse('  ')).toEqual({ value: null });
    expect(idCodec.parse('null')).toEqual({ value: null });
  });

  it('read both coordinate spellings and reject half-filled or out of range positions', () => {
    expect(positionCodec.parse('{"latitude":"1.5","longitude":2}')).toEqual({
      value: { Latitude: 1.5, Longitude: 2 },
    });
    expect(positionCodec.parse('{}')).toEqual({ value: null });
    expect(positionCodec.parse('{"lat":1}')).toBeUndefined();
    expect(positionCodec.parse('{"lat":91,"lng":0}')).toBeUndefined();
    expect(positionCodec.parse('not json')).toBeUndefined();
    expect(positionCodec.format({ Latitude: 1, Longitude: 2 })).toBe('{"lat":1,"lng":2}');
  });

  it('write the scaling state with the UI control names and a recomputed reading length', () => {
    const parsed = scalingCalculatorStateCodec.parse('{"DeviceType":0,"ReadingFrom":"10","ReadingTo":30}')!;
    expect(parsed.value).toMatchObject({ DeviceType: '0', ReadingFrom: 10, ReadingTo: 30, ReadingUnit: null });

    const written = JSON.parse(scalingCalculatorStateCodec.format(parsed.value)!);
    expect(written).toMatchObject({ deviceTypeControl: '0', readingFromControl: 10, readingLengthControl: 20 });
    expect(written).not.toHaveProperty('DeviceType');
  });
});

describe('groupAdapterV4', () => {
  it('promotes the legacy keys and keeps third-party keys and OO attributes', () => {
    const entity: any = groupAdapterV4.fromWire(group423(), v423);
    expect(entity.Position).toEqual(field({ Latitude: 48.1371, Longitude: 11.5754 }));
    expect(entity.Icon).toEqual(field('adk-factory', ['Overwritten']));
    expect(entity.Order).toEqual(field(2));
    expect(entity.Picture).toEqual(field('File(6501f00000000000000000f1)'));
    expect(Object.keys(entity.AdditionalFields).sort()).toEqual(['Synchronized', 'ThirdParty']);
  });

  it('reads the same values as the v5 migration produced', () => {
    const v4: any = applyFromWire(EntityType.Group, group423(), v423);
    const v5: any = applyFromWire(EntityType.Group, group50(), v50);
    for (const key of ['Position', 'Icon', 'Order', 'Picture']) {
      expect(v4[key], key).toEqual(v5[key]);
    }
    expect(v4.AdditionalFields).toEqual(v5.AdditionalFields);
    expect(v4.StartDashboardId).toBeUndefined();
  });

  it('leaves an unconvertible value in the map and keeps it on write', () => {
    const wire = group423();
    wire.AdditionalFields.Order = field('first');
    const entity: any = applyFromWire(EntityType.Group, wire, v423);
    expect(entity.Order).toEqual(field(null));
    expect(entity.AdditionalFields.Order).toEqual(field('first'));

    const payload: any = applyToWire(EntityType.Group, entity, v423);
    expect(payload.AdditionalFields.Order).toEqual(field('first'));
  });

  it('writes the legacy strings back and removes cleared keys', () => {
    const entity: any = applyFromWire(EntityType.Group, group423(), v423);
    entity.Order = field(5);
    entity.Icon = field(null);

    const payload: any = applyToWire(EntityType.Group, entity, v423);
    expect(payload.AdditionalFields.Order).toEqual(field('5'));
    expect(payload.AdditionalFields.Position).toEqual(field('{"lat":48.1371,"lng":11.5754}'));
    expect(payload.AdditionalFields).not.toHaveProperty('Icon');
    expect(payload.AdditionalFields.ThirdParty).toEqual(field('keep me'));
    for (const key of ['Order', 'Icon', 'Position', 'Picture']) {
      expect(payload, key).not.toHaveProperty(key);
    }
  });

  it('round-trips through 4.23', () => {
    const { Path, ...canonical }: any = applyFromWire(EntityType.Group, group423(), v423);
    const payload = applyToWire(EntityType.Group, canonical, v423);
    expect(payload.AdditionalFields).toEqual(group423().AdditionalFields);
    expect(applyFromWire(EntityType.Group, payload, v423)).toEqual({ ...canonical, Path: [] });
  });

  it('is identity on v5', () => {
    const wire = group50();
    expect(groupAdapterV4.fromWire(wire, v50)).toBe(wire);
    expect(groupAdapterV4.toWire(wire, v50)).toBe(wire);
  });

  it('does not mutate the wire payload', () => {
    const wire = group423();
    const before = JSON.stringify(wire);
    groupAdapterV4.fromWire(wire, v423);
    expect(JSON.stringify(wire)).toBe(before);
  });
});

describe('signalAdapterV4', () => {
  it('keeps an explicit CounterChecked "false"', () => {
    const entity: any = applyFromWire(EntityType.Signal, counter423(), v423);
    expect(entity.Settings.EnforceMonotonicInput).toEqual(field(false));
    expect(entity.Color).toEqual(field('#ff8800'));
    expect(entity.MultiLineAddress).toEqual(field(false));
    expect(entity.AdditionalFields).not.toHaveProperty('CounterChecked');
  });

  it('defaults a counter without CounterChecked to monotonic input', () => {
    const wire = counter423();
    delete wire.AdditionalFields.CounterChecked;
    const entity: any = applyFromWire(EntityType.Signal, wire, v423);
    expect(entity.Settings.EnforceMonotonicInput.Value).toBe(true);
  });

  it('always writes an explicit CounterChecked to a counter', () => {
    const wire = counter423();
    delete wire.AdditionalFields.CounterChecked;
    const payload: any = applyToWire(EntityType.Signal, applyFromWire(EntityType.Signal, wire, v423), v423);
    expect(payload.AdditionalFields.CounterChecked).toEqual(field('true'));
    expect(payload.Settings).not.toHaveProperty('EnforceMonotonicInput');
  });

  it('leaves the scaling state of a counter in the map', () => {
    const entity: any = applyFromWire(EntityType.Signal, counter423(), v423);
    expect(entity.AdditionalFields.ScalingCalculatorFormState).toEqual(field('null'));
    expect(entity.Settings).not.toHaveProperty('ScalingCalculatorState');
  });

  it('does not fill a counter with the analog defaults', () => {
    const entity: any = applyFromWire(EntityType.Signal, counter423(), v423);
    expect(entity.Settings).not.toHaveProperty('MinValue');
    expect(entity.Settings).not.toHaveProperty('DefaultValue');
  });

  it('reads the scaling state of an analog signal as the v5 migration produced', () => {
    const v4: any = applyFromWire(EntityType.Signal, analog423(), v423);
    const v5: any = applyFromWire(EntityType.Signal, analog50(), v50);
    expect(v4.Settings.ScalingCalculatorState).toEqual(v5.Settings.ScalingCalculatorState);
    expect(v4.MultiLineAddress).toEqual(v5.MultiLineAddress);
    expect(v4.AdditionalFields).toEqual({});
  });

  it('round-trips an analog signal through 4.23', () => {
    const canonical = applyFromWire(EntityType.Signal, analog423(), v423);
    const payload: any = applyToWire(EntityType.Signal, canonical, v423);
    // Same keys and order as the UI wrote; the numeric string "10" comes back as a number.
    expect(payload.AdditionalFields.ScalingCalculatorFormState.Value).toBe(
      analog423().AdditionalFields.ScalingCalculatorFormState.Value.replace('"10"', '10'),
    );
    expect(applyFromWire(EntityType.Signal, payload, v423)).toEqual(canonical);
  });

  it('does not fill the counter default on a projected read without Settings', () => {
    const entity: any = signalAdapterV4.fromWire({ Id: 's1', Color: field(null) }, v423, 'projected');
    expect(entity).not.toHaveProperty('Settings');
  });
});

describe('event category and definition keys', () => {
  it('promote Icon and Color next to the Acknowledgment rename', () => {
    const wire = loadFixture('v4/event-category.4.12.json');
    wire.AdditionalFields = { Icon: field('adk-hb'), Color: field('#AA0000') };
    const entity: any = eventCategoryAdapterV4.fromWire(wire, v412);
    expect(entity.Icon).toEqual(field('adk-hb'));
    expect(entity.Color).toEqual(field('#aa0000'));
    expect(entity.RequiresAcknowledgment).toEqual(field(true));

    const payload: any = eventCategoryAdapterV4.toWire(entity, v412);
    expect(payload.AdditionalFields).toEqual({ Icon: field('adk-hb'), Color: field('#aa0000') });
    expect(payload).not.toHaveProperty('Icon');
  });

  it('promote BlocklyXML', () => {
    const wire = loadFixture('v4/event-definition.4.23.json');
    wire.AdditionalFields = { BlocklyXML: field('<xml/>') };
    const entity: any = eventDefinitionAdapterV4.fromWire(wire, v423);
    expect(entity.BlocklyXml).toEqual(field('<xml/>'));

    const payload: any = eventDefinitionAdapterV4.toWire(entity, v423);
    expect(payload.AdditionalFields.BlocklyXML).toEqual(field('<xml/>'));
    expect(payload).not.toHaveProperty('BlocklyXml');
  });
});

describe('shared Synchronized pass', () => {
  it('reads the v4 flag as the unknown partner and restores it on write', () => {
    const entity: any = applyFromWire(EntityType.Group, group423(), v423);
    expect(entity.SynchronizedFrom).toBe('unknown');
    expect(entity.AdditionalFields).not.toHaveProperty('Synchronized');

    const payload: any = applyToWire(EntityType.Group, entity, v423);
    expect(payload.AdditionalFields.Synchronized).toEqual(field('true'));
    expect(payload).not.toHaveProperty('SynchronizedFrom');
  });

  it('applies to entity types without an adapter', () => {
    const entity: any = applyFromWire(
      EntityType.DataSource,
      { Id: 'd1', AdditionalFields: { Synchronized: field('true') } },
      v423,
    );
    expect(entity.SynchronizedFrom).toBe('unknown');
  });

  it('strips the server-owned provenance on v5 writes', () => {
    const canonical: any = applyFromWire(EntityType.Signal, analog50(), v50);
    canonical.ManagedBy = 'm1';
    canonical.SynchronizedFrom = 'p1';
    const payload: any = applyToWire(EntityType.Signal, canonical, v50);
    expect(payload).not.toHaveProperty('ManagedBy');
    expect(payload).not.toHaveProperty('SynchronizedFrom');
    expect(payload.AdditionalFields).toEqual({});
  });
});
