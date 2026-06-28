import { BaseWidgetConfig } from './shared.js';
export declare enum WidgetEventListFilterType {
    Group = "Group",
    EventCategory = "EventCategory",
    EventDefinition = "EventDefinition"
}
export declare enum WidgetEventListFilterTypeTranslation {
    Group = "GROUP",
    EventCategory = "EVENTCATEGORY",
    EventDefinition = "EVENTDEFINITION"
}
export interface Sort {
    active: string;
    direction: 'asc' | 'desc' | '';
}
export declare const WidgetEventListConfigVersion = "1";
export declare class WidgetEventListConfig extends BaseWidgetConfig {
    filterType: WidgetEventListFilterType;
    filteredEntities: string[];
    withSubGroups: boolean;
    defaultSort: Sort;
    constructor(options?: Partial<WidgetEventListConfig>);
}
