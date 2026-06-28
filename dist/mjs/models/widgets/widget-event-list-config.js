import { BaseWidgetConfig } from './shared.js';
export var WidgetEventListFilterType;
(function (WidgetEventListFilterType) {
    WidgetEventListFilterType["Group"] = "Group";
    WidgetEventListFilterType["EventCategory"] = "EventCategory";
    WidgetEventListFilterType["EventDefinition"] = "EventDefinition";
})(WidgetEventListFilterType || (WidgetEventListFilterType = {}));
export var WidgetEventListFilterTypeTranslation;
(function (WidgetEventListFilterTypeTranslation) {
    WidgetEventListFilterTypeTranslation["Group"] = "GROUP";
    WidgetEventListFilterTypeTranslation["EventCategory"] = "EVENTCATEGORY";
    WidgetEventListFilterTypeTranslation["EventDefinition"] = "EVENTDEFINITION";
})(WidgetEventListFilterTypeTranslation || (WidgetEventListFilterTypeTranslation = {}));
export const WidgetEventListConfigVersion = '1';
export class WidgetEventListConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetEventListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
