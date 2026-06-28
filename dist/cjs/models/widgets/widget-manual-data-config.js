"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineOptions = exports.AcquisitionUnit = exports.AcquisitionInterval = exports.WidgetManualDataConfig = exports.WidgetManualDataConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetManualDataConfigVersion = '4';
class WidgetManualDataConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetManualDataConfigVersion;
        this.acquisitionInterval = AcquisitionInterval.Month;
        this.acquisitionUnit = AcquisitionUnit.DayValues;
        this.manualDataSignalMasks = [];
        this.additionalOptions = {};
        this.timelineOption = TimelineOptions.AUTO;
        this.showStatusIcons = true;
        this.showAlias = false;
        this.showPreviousPermanent = false;
        this.showPreviousDefault = true;
        this.autoSaveAndNext = true;
    }
}
exports.WidgetManualDataConfig = WidgetManualDataConfig;
var AcquisitionInterval;
(function (AcquisitionInterval) {
    AcquisitionInterval["Week"] = "Week";
    AcquisitionInterval["Month"] = "Month";
    AcquisitionInterval["Year"] = "Year";
})(AcquisitionInterval || (exports.AcquisitionInterval = AcquisitionInterval = {}));
var AcquisitionUnit;
(function (AcquisitionUnit) {
    AcquisitionUnit["ProcessValues"] = "ProcessValues";
    AcquisitionUnit["HourValues"] = "HourValues";
    AcquisitionUnit["DayValues"] = "DayValues";
    AcquisitionUnit["WeekValues"] = "WeekValues";
    AcquisitionUnit["MonthValues"] = "MonthValues";
    AcquisitionUnit["YearValues"] = "YearValues";
})(AcquisitionUnit || (exports.AcquisitionUnit = AcquisitionUnit = {}));
var TimelineOptions;
(function (TimelineOptions) {
    TimelineOptions["ENABLED"] = "0";
    TimelineOptions["DISABLED"] = "1";
    TimelineOptions["AUTO"] = "2";
})(TimelineOptions || (exports.TimelineOptions = TimelineOptions = {}));
