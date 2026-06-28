import { BaseWidgetConfig } from './shared.js';
export const WidgetEnteredEventConfigVersion = '2';
export class WidgetEnteredEventConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetEnteredEventConfigVersion;
        this.filterType = 'Group';
        this.onlyActive = false;
        this.requestIntervalType = RequestIntervalType.Minutes;
        this.requestInterval = 5;
        this.selectedFilter = [];
        this.filterWithSubgroup = false;
        if (options) {
            Object.assign(this, options);
        }
    }
}
export var RequestIntervalType;
(function (RequestIntervalType) {
    RequestIntervalType["Seconds"] = "Seconds";
    RequestIntervalType["Minutes"] = "Minutes";
})(RequestIntervalType || (RequestIntervalType = {}));
