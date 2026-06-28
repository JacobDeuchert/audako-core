import { BaseWidgetConfig } from './shared.js';
export declare const WidgetLiveModeConfigVersion = "2";
export declare class WidgetLiveModeConfig extends BaseWidgetConfig {
    id: string;
    queryType: 'Datasource' | 'DataConnection';
    title: string;
    constructor();
}
