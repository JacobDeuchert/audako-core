import { BaseWidgetConfig, ValueEntity, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const MapAnalysesConfigVersion: string = '3';

export enum MapAnalysisValueDisplayType {
  LastValue = 'LastValue',
  Difference = 'Difference',
  Average = 'Average',
}

export type MapAnalysisValueEntity = ValueEntity & {
  displayType: MapAnalysisValueDisplayType;
  label?: string;
};

export type MapAnalysisEntry = {
  color: string;
  eventDefinitionId: string;
  valueEntities: MapAnalysisValueEntity[];
};

export type MapAnalysisObject = {
  name: string;
  latitudeEntity: ValueEntity;
  longitudeEntity: ValueEntity;
  analysisEntries: MapAnalysisEntry[];
  compressionInterval: CompressionInterval;
  drawPathLine: boolean;
  pathLineWidth: number;
  pathLineColor: string;
};

export type MapAnalysisDisplayOptions = {
  showTimestamp: boolean;
  showLatLng: boolean;
  showDuration: boolean;
};

export const DEFAULT_MAP_ANALYSIS_DISPLAY_OPTIONS: MapAnalysisDisplayOptions = {
  showTimestamp: true,
  showLatLng: true,
  showDuration: true,
};

export class WidgetMapAnalysesConfig extends BaseWidgetConfig {
  analysesObjects: MapAnalysisObject[];
  timeManagementSettings: TimeManagementSettings;
  historicalSetting: IntervalSettings;
  displayOptions: MapAnalysisDisplayOptions;

  constructor(config: Omit<Partial<WidgetMapAnalysesConfig>, 'version'> = {}) {
    super();
    Object.assign(this, config);
    this.version = MapAnalysesConfigVersion;
  }
}
