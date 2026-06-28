"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.widgetReport_Name = exports.TimeStepSize = exports.WidgetReportConfig = exports.WidgetReportConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetReportConfigVersion = '2';
class WidgetReportConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetReportConfigVersion;
        this.TemplateTimeSteps = {};
    }
}
exports.WidgetReportConfig = WidgetReportConfig;
var TimeStepSize;
(function (TimeStepSize) {
    TimeStepSize["Day"] = "Day";
    TimeStepSize["Week"] = "Week";
    TimeStepSize["Month"] = "Month";
    TimeStepSize["Year"] = "Year";
})(TimeStepSize || (exports.TimeStepSize = TimeStepSize = {}));
exports.widgetReport_Name = 'WidgetReport';
