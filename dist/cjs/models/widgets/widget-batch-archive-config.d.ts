import { BaseWidgetConfig } from './shared.js';
export declare const WidgetBatchArchiveConfigVersion = "1";
export declare class WidgetBatchArchiveConfig implements BaseWidgetConfig {
    version: string;
    headerExpanded: boolean;
    title: string;
    filterType: 'Group' | 'BatchDefinition';
    selectedFilter: string[];
    filterWithSubgroup: boolean;
    withBatchReview: boolean;
    batchListColumns: string[];
    constructor(config?: Omit<Partial<WidgetBatchArchiveConfig>, 'version'>);
}
