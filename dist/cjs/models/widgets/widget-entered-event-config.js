"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIntervalType = exports.WidgetEnteredEventConfig = exports.WidgetEnteredEventConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetEnteredEventConfigVersion = '2';
class WidgetEnteredEventConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetEnteredEventConfigVersion;
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
exports.WidgetEnteredEventConfig = WidgetEnteredEventConfig;
var RequestIntervalType;
(function (RequestIntervalType) {
    RequestIntervalType["Seconds"] = "Seconds";
    RequestIntervalType["Minutes"] = "Minutes";
})(RequestIntervalType || (exports.RequestIntervalType = RequestIntervalType = {}));
