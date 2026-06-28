import { BaseWidgetConfig, XYChartConfig } from './shared.js';

export interface TimeFrame {
  Hours: number;
  Minutes: number;
}

export const WidgetLiveChartConfigVersion = '1';

export class WidgetLiveChartConfig extends BaseWidgetConfig {
  chartConfig: XYChartConfig;
  signals: string[];
  timeFrame: TimeFrame;
  autoZoom: boolean;

  constructor() {
    super();
    this.signals = [];
    this.chartConfig = new XYChartConfig();
  }
}
