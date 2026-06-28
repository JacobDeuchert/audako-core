import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const WidgetHeatMapChartConfigVersion = '2';

export class HeatMapCategoryAxisOptions {
  category: string;
}

export class HeatMapColumnSeriesOptions {
  customUnit?: string;
  borderRadius?: number;
  decimalPlaces?: number;
}

export class HeatMapChartConfig {
  xAxis: HeatMapCategoryAxisOptions;
  yAxis: HeatMapCategoryAxisOptions;
  series: HeatMapColumnSeriesOptions;
  minColor: string;
  maxColor: string;
  title: string;
}

export class WidgetHeatMapChartConfig extends BaseWidgetConfig {
  chartConfig: HeatMapChartConfig;
  dataSettings: HeatMapDataSettings;
  historicalSetting: IntervalSettings;
  timeManagementSettings: TimeManagementSettings;

  constructor() {
    super();
    this.version = WidgetHeatMapChartConfigVersion;
  }
}

export interface HeatMapDataSettings {
  signalId: string;
  compressionInterval: CompressionInterval;
}
