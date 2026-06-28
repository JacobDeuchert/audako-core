import { BaseWidgetConfig, IntervalSettings, TimeManagementSettings } from './shared.js';
import { CompressionInterval } from '../historical-value.model.js';
export declare const WidgetSankeyChartConfigVersion = "2";
export declare enum SankeyChartWidgetFormAggregationTypes {
    Sum = "Sum",
    Average = "Average"
}
export interface NodeConnection {
    FromNode: string;
    ToNode: string;
    Type: 'Signal' | 'Formula';
    ObjectId: string;
    Aggregation: SankeyChartWidgetFormAggregationTypes;
}
export declare class WidgetSankeyChartConfig extends BaseWidgetConfig {
    relations: NodeConnection[];
    nodes: WidgetSankeyNode[];
    connections: WidgetSankeyConnection[][];
    historicalSetting: IntervalSettings;
    timeManagementSettings: TimeManagementSettings;
    compressionSettings: CompressionInterval;
    unit: string;
    constructor();
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
