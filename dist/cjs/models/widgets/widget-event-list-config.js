"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetEventListConfig = exports.WidgetEventListConfigVersion = exports.WidgetEventListFilterTypeTranslation = exports.WidgetEventListFilterType = void 0;
const shared_js_1 = require("./shared.js");
var WidgetEventListFilterType;
(function (WidgetEventListFilterType) {
    WidgetEventListFilterType["Group"] = "Group";
    WidgetEventListFilterType["EventCategory"] = "EventCategory";
    WidgetEventListFilterType["EventDefinition"] = "EventDefinition";
})(WidgetEventListFilterType || (exports.WidgetEventListFilterType = WidgetEventListFilterType = {}));
var WidgetEventListFilterTypeTranslation;
(function (WidgetEventListFilterTypeTranslation) {
    WidgetEventListFilterTypeTranslation["Group"] = "GROUP";
    WidgetEventListFilterTypeTranslation["EventCategory"] = "EVENTCATEGORY";
    WidgetEventListFilterTypeTranslation["EventDefinition"] = "EVENTDEFINITION";
})(WidgetEventListFilterTypeTranslation || (exports.WidgetEventListFilterTypeTranslation = WidgetEventListFilterTypeTranslation = {}));
exports.WidgetEventListConfigVersion = '1';
class WidgetEventListConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetEventListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetEventListConfig = WidgetEventListConfig;
