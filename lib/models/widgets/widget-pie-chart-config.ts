import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const WidgetPieChartConfigVersion = '5';

export class WidgetPieChartConfig extends BaseWidgetConfig {
  dataSettings: PieChartDataSettings[];
  compressionSettings: CompressionInterval;
  historicalSetting: IntervalSettings;
  chartConfig: PieChartConfig;
  timeManagementSettings: TimeManagementSettings;
  unit: string;

  constructor() {
    super();
    this.unit = '';
    this.version = WidgetPieChartConfigVersion;
    this.compressionSettings = CompressionInterval.DayInterval;
    this.historicalSetting = new IntervalSettings();
    this.timeManagementSettings = new TimeManagementSettings();
    this.headerExpanded = false;
  }
}

export interface PieChartDataSettings {
  entityId: string;
  available: boolean;
  aggregation: number;
  label: string;
  color: string;
  unit: string;
  entityType?: 'Signal' | 'Formula';
}

export class PieChartConfig {
  title: string;
  legendSettings: LegendSettings;
  series: PieSeriesOptions[];
  innerRadius: number;
  endAngle: number;
  startAngle: number;
  groupingEnabled: boolean;
  groupingThreshold?: number;
  groupingName: string;
  radius?: number;
}

export interface LegendSettings {
  visible: boolean;
}

export interface PieSeriesOptions {
  decimalPlaces?: number;
  unit?: string;
  radius?: number;
  value: string;
  category: string;
  disableLabels?: boolean;
  textFormat?: string;
}
