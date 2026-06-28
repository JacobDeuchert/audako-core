import { BaseWidgetConfig } from './shared.js';
export declare const WidgetDataImportConfigVersion = "1";
export declare class WidgetDataImportConfig extends BaseWidgetConfig {
    title: string;
    signals: string[];
    version: string;
    constructor(options?: Partial<WidgetDataImportConfig>);
}
