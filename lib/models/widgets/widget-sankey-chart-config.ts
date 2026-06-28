import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';

export const WidgetSankeyChartConfigVersion = '2';

export enum SankeyChartWidgetFormAggregationTypes {
  Sum = 'Sum',
  Average = 'Average',
}

export interface NodeConnection {
  FromNode: string;
  ToNode: string;
  Type: 'Signal' | 'Formula';
  ObjectId: string;
  Aggregation: SankeyChartWidgetFormAggregationTypes;
}

export class WidgetSankeyChartConfig extends BaseWidgetConfig {
  relations: NodeConnection[];
  nodes: WidgetSankeyNode[];
  connections: WidgetSankeyConnection[][];
  historicalSetting: IntervalSettings;
  timeManagementSettings: TimeManagementSettings;
  compressionSettings: CompressionInterval;
  unit: string;

  constructor() {
    super();
    this.unit = '';
    this.nodes = [];
    this.connections = [];
    this.version = WidgetSankeyChartConfigVersion;
    this.timeManagementSettings = new TimeManagementSettings();
    this.compressionSettings = CompressionInterval.DayInterval;
  }
}

export interface WidgetSankeyNode {
  Name: string;
  Color: string;
  Id: string;
}

export interface WidgetSankeyConnection {
  Type: 'Signal' | 'Formula';
  ObjectId: string;
  Index: number;
  Aggregation: SankeyChartWidgetFormAggregationTypes;
}
