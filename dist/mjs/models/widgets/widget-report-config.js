import { BaseWidgetConfig } from './shared.js';
export const WidgetReportConfigVersion = '2';
export class WidgetReportConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetReportConfigVersion;
        this.TemplateTimeSteps = {};
    }
}
export var TimeStepSize;
(function (TimeStepSize) {
    TimeStepSize["Day"] = "Day";
    TimeStepSize["Week"] = "Week";
    TimeStepSize["Month"] = "Month";
    TimeStepSize["Year"] = "Year";
})(TimeStepSize || (TimeStepSize = {}));
export const widgetReport_Name = 'WidgetReport';
