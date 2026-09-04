import { describe, expect, it } from 'vitest';
import { baseFromWire } from '../../../lib/compat/adapters/entity-adapter.js';
import { EntityType } from '../../../lib/models/entities/configuration-entity.model.js';
import { DataSource, PermaLiveModeSettings } from '../../../lib/models/entities/data-source.model.js';
import { Formula, FormulaIntervalSettings } from '../../../lib/models/entities/formula.model.js';

describe('baseFromWire nested defaults', () => {
  it('fills a whole nested settings object the server left null', () => {
    const entity: any = baseFromWire({ Id: 'ds1', PermaLiveModeSettings: null }, EntityType.DataSource);
    expect(entity.PermaLiveModeSettings).toEqual(new PermaLiveModeSettings());
  });

  it('fills null members inside a partially populated nested settings object', () => {
    // The earliest 4.15 builds emit FormulaIntervalSettings.ProvideLastValues as null
    // (docs/analysis/v4-models-4.13-4.15.md).
    const entity: any = baseFromWire(
      {
        Id: 'f1',
        ProcessIntervalSettings: {
          Formula: { Value: 'a+b', OOAttributes: [] },
          ProvideLastValues: null,
        },
      },
      EntityType.Formula,
    );

    expect(entity.ProcessIntervalSettings.ProvideLastValues).toEqual(new FormulaIntervalSettings().ProvideLastValues);
    expect(entity.ProcessIntervalSettings.Formula.Value).toBe('a+b');
    // untouched sibling still gets the full default object
    expect(entity.DayIntervalSettings).toEqual(new FormulaIntervalSettings());
  });

  it('never overwrites a Field whose Value is null', () => {
    const entity: any = baseFromWire(
      { Id: 'f1', ProcessIntervalSettings: { CompressionType: { Value: null, OOAttributes: [] } } },
      EntityType.Formula,
    );
    expect(entity.ProcessIntervalSettings.CompressionType.Value).toBeNull();
  });

  it('does not mutate the nested wire objects', () => {
    const wire: any = { Id: 'f1', ProcessIntervalSettings: { ProvideLastValues: null } };
    baseFromWire(wire, EntityType.Formula);
    expect(wire.ProcessIntervalSettings).toEqual({ ProvideLastValues: null });
  });

  it('hands out an independent copy of the defaults to every read', () => {
    const first: any = baseFromWire({ Id: 'ds1' }, EntityType.DataSource);
    first.PermaLiveModeSettings.Enabled.Value = true;

    const second: any = baseFromWire({ Id: 'ds2' }, EntityType.DataSource);
    expect(second.PermaLiveModeSettings.Enabled.Value).toBe(false);
    expect(new DataSource().PermaLiveModeSettings.Enabled.Value).toBe(false);
  });

  it('keeps the class prototypes of the filled defaults', () => {
    const entity: any = baseFromWire({ Id: 'ds1' }, EntityType.DataSource);
    expect(entity.PermaLiveModeSettings).toBeInstanceOf(PermaLiveModeSettings);
    expect(entity.CreatedOn).toBeInstanceOf(Date);
  });

  it('leaves _t discriminated sub-settings alone (no template on the default instance)', () => {
    // DataConnection.Settings defaults to null, so the nested pass cannot reach
    // OpcUaSettings.TimestampSource; it stays whatever the platform sent.
    const entity: any = baseFromWire(
      { Id: 'dc1', Settings: { _t: 'DataConnectionOpcUaSettings', TimestampSource: null } },
      EntityType.DataConnection,
    );
    expect(entity.Settings.TimestampSource).toBeNull();
  });
});

describe('Formula variables', () => {
  it('array elements are not default-filled either', () => {
    // Formula.Variables defaults to [], so FormulaVariable.TagScope keeps the server's null.
    const entity: any = baseFromWire({ Id: 'f1', Variables: [{ TagScope: null }] }, EntityType.Formula);
    expect(entity.Variables[0].TagScope).toBeNull();
    expect(new Formula().Variables).toEqual([]);
  });
});
