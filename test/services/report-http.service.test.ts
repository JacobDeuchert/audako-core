import { describe, expect, it } from 'vitest';
import {
  AnyReportElementSettings,
  ReportElementSettingsType,
  ReportReferenceValue,
  ReportSettings,
  isReportReferenceValue,
} from '../../lib/models/entities/report.model.js';
import { ReportHttpService } from '../../lib/services/report-http.service.js';
import { stubContext } from './api-context-stub.js';

function createService(version: '4.23.0' | '5.0.0' = '5.0.0') {
  const { ctx, request } = stubContext(version);
  return { service: new ReportHttpService(ctx), request: request };
}

const SETTINGS = {
  GeneralSettings: [{ Key: 'title', Label: 'Title', Type: 'TextBox', DefaultValue: '', PossibleValues: {} }],
  ElementSettings: {
    valueTable: {
      _t: 'ReportTableSettings',
      Label: 'Values',
      NumberOfColumns: -1,
      NumberOfHeaders: 0,
      EntrySettings: [
        {
          Key: 'source',
          Label: 'Signal',
          Type: 'Signal',
          DefaultValue: 'Signal',
          PossibleValues: { Signal: 'Signal', Formula: 'Formel' },
        },
      ],
    },
  },
} as ReportSettings;

describe('ReportHttpService', () => {
  it('reads the settings of a template on v5', async () => {
    const { service, request } = createService();
    request.mockResolvedValue({ status: 200, data: SETTINGS, headers: {} });

    await expect(service.getTemplateSettings('t1')).resolves.toEqual(SETTINGS);

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/v1/reporting/reports/t1/settings');
  });

  it('uses the singular report route on v4', async () => {
    const { service, request } = createService('4.23.0');

    await service.getTemplateSettings('t1');

    const config = request.mock.calls[0][0];
    expect(config.method).toBe('GET');
    expect(config.url).toBe('https://host/api/reporting/report/t1/settings');
  });

  it('narrows element settings on _t', () => {
    const settings = SETTINGS.ElementSettings.valueTable as AnyReportElementSettings;

    if (settings._t !== ReportElementSettingsType.Table) {
      throw new Error('expected table settings');
    }
    expect(settings.EntrySettings[0].Key).toBe('source');
  });

  it('tells reference values from plain ones', () => {
    const formula: ReportReferenceValue = { id: 'f1', type: 'Formula' };

    expect(isReportReferenceValue(formula)).toBe(true);
    expect(isReportReferenceValue({ id: null, type: 'Signal' })).toBe(true);
    expect(isReportReferenceValue({ value: 'true' })).toBe(false);
    expect(isReportReferenceValue(undefined)).toBe(false);
  });
});
