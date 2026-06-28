import { BaseWidgetConfig } from './shared.js';
export const WidgetManualDataConfigVersion = '4';
export class WidgetManualDataConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetManualDataConfigVersion;
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
export var AcquisitionInterval;
(function (AcquisitionInterval) {
    AcquisitionInterval["Week"] = "Week";
    AcquisitionInterval["Month"] = "Month";
    AcquisitionInterval["Year"] = "Year";
})(AcquisitionInterval || (AcquisitionInterval = {}));
export var AcquisitionUnit;
(function (AcquisitionUnit) {
    AcquisitionUnit["ProcessValues"] = "ProcessValues";
    AcquisitionUnit["HourValues"] = "HourValues";
    AcquisitionUnit["DayValues"] = "DayValues";
    AcquisitionUnit["WeekValues"] = "WeekValues";
    AcquisitionUnit["MonthValues"] = "MonthValues";
    AcquisitionUnit["YearValues"] = "YearValues";
})(AcquisitionUnit || (AcquisitionUnit = {}));
export var TimelineOptions;
(function (TimelineOptions) {
    TimelineOptions["ENABLED"] = "0";
    TimelineOptions["DISABLED"] = "1";
    TimelineOptions["AUTO"] = "2";
})(TimelineOptions || (TimelineOptions = {}));
