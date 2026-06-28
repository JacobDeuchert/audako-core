import {
  BaseWidgetConfig,
  IntervalSettings,
  TimeManagementSettings,
  XYChartConfig,
} from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const WidgetBasicXyChartConfigVersion = '7';

export class WidgetBasicXyChartConfig extends BaseWidgetConfig {
  dataSettings: DataSetting[];
  historicalSetting: IntervalSettings;
  chartConfig: XYChartConfig;
  timeManagementSettings: TimeManagementSettings;
  liveDataSettings: Partial<IXYChartLiveDataSettings>;

  constructor() {
    super();
    this.version = WidgetBasicXyChartConfigVersion;
    this.dataSettings = [];
    this.historicalSetting = new IntervalSettings();
    this.chartConfig = new XYChartConfig();
    this.timeManagementSettings = new TimeManagementSettings();
    this.liveDataSettings = {
      displayTimeRange: 0,
      startupType: false,
      enabled: false,
      autoZoom: false,
    };
  }
}

export interface DataSetting {
  objectId: string;
  dataType: 'Signal' | 'Formula';
  compressionInterval: CompressionInterval;
}

export interface IXYChartLiveDataSettings {
  displayTimeRange: number;
  startupType: boolean;
  enabled: boolean;
  autoZoom: boolean;
}
