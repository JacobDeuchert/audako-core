"use strict";
// Shared types reused across dashboard widget configuration models.
//
// Each widget's stored JSON `config` is an instance of a class extending
// `BaseWidgetConfig`. The base class always contributes `version`, `title`, and
// `headerExpanded` (default `false`). The types below are the non-base shapes that
// recur across several widget configs.
//
// Mirrors the audako-ui sources:
//   - src/app/shared/widgets/base-widget-config.ts
//   - src/app/shared/widgets/widget-entity.ts
//   - src/app/shared/components/audako-time-management-config/AudakoTimeManagement.model.ts
//   - src/app/shared/utils/time/time-util.ts
//   - src/app/apps/application/shared/services/historical-values.service.ts
//   - src/app/shared/components/audako-chart-modules/audako-xy-chart/chart.interface.ts
//   - src/app/shared/components/audako-chart-modules/core/AudakoXYChart/audako-xy-chart.options.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.XYChartConfig = exports.ValueAxisOptions = exports.GuidelineOptions = exports.AxisOptions = exports.ColumnSeriesOptions = exports.LineSeriesOptions = exports.StepLineSeriesOptions = exports.SeriesOptions = exports.SeriesType = exports.IntervalSettings = exports.ObservationPeriodUnits = exports.TimeManagementSettings = exports.ValueEntityType = exports.BaseWidgetConfig = void 0;
// ---------------------------------------------------------------------------
// Base widget config
// ---------------------------------------------------------------------------
class BaseWidgetConfig {
    constructor() {
        this.headerExpanded = false;
    }
}
exports.BaseWidgetConfig = BaseWidgetConfig;
var ValueEntityType;
(function (ValueEntityType) {
    ValueEntityType["Signal"] = "Signal";
    ValueEntityType["Formula"] = "Formula";
})(ValueEntityType || (exports.ValueEntityType = ValueEntityType = {}));
// ---------------------------------------------------------------------------
// Time / observation settings
// ---------------------------------------------------------------------------
class TimeManagementSettings {
    constructor() {
        this.channels = [];
        this.enabled = false;
        this.timecontrol = false;
    }
}
exports.TimeManagementSettings = TimeManagementSettings;
var ObservationPeriodUnits;
(function (ObservationPeriodUnits) {
    ObservationPeriodUnits["Second"] = "Second";
    ObservationPeriodUnits["Minute"] = "Minute";
    ObservationPeriodUnits["Hour"] = "Hour";
    ObservationPeriodUnits["Day"] = "Day";
    ObservationPeriodUnits["Week"] = "Week";
    ObservationPeriodUnits["Month"] = "Month";
    ObservationPeriodUnits["Quarter"] = "Quarter";
    ObservationPeriodUnits["Year"] = "Year";
})(ObservationPeriodUnits || (exports.ObservationPeriodUnits = ObservationPeriodUnits = {}));
class IntervalSettings {
    constructor() {
        this.periodOfTime = ObservationPeriodUnits.Day;
        this.amountOfTimePeriods = 1;
        this.beginningOfaDay = '00:00';
        this.beginningOfaWeek = 1;
        this.offsetOfTimePeriods = 0;
    }
}
exports.IntervalSettings = IntervalSettings;
var SeriesType;
(function (SeriesType) {
    SeriesType["StepSeriesOptions"] = "StepSeriesOptions";
    SeriesType["StepLineSeriesOptions"] = "StepLineSeriesOptions";
    SeriesType["LineSeriesOptions"] = "LineSeriesOptions";
    SeriesType["SmoothedLineSeriesOptions"] = "SmoothedLineSeriesOptions";
    SeriesType["ColumnSeriesOptions"] = "ColumnSeriesOptions";
})(SeriesType || (exports.SeriesType = SeriesType = {}));
class SeriesOptions {
}
exports.SeriesOptions = SeriesOptions;
class StepLineSeriesOptions extends SeriesOptions {
}
exports.StepLineSeriesOptions = StepLineSeriesOptions;
class LineSeriesOptions extends SeriesOptions {
    constructor() {
        super(...arguments);
        this.tension = { tensionX: 0.89, tensionY: 1 };
    }
}
exports.LineSeriesOptions = LineSeriesOptions;
class ColumnSeriesOptions extends SeriesOptions {
}
exports.ColumnSeriesOptions = ColumnSeriesOptions;
class AxisOptions {
}
exports.AxisOptions = AxisOptions;
class GuidelineOptions {
}
exports.GuidelineOptions = GuidelineOptions;
class ValueAxisOptions extends AxisOptions {
    constructor() {
        super();
        this.unit = '';
    }
}
exports.ValueAxisOptions = ValueAxisOptions;
class XYChartConfig {
    constructor() {
        this.title = '';
        this.yAxis = [];
        this.series = [];
        this.guidelines = [];
        this.enableScrollbar = false;
        this.smallLegend = false;
        this.legend = true;
        this.showAggregationGuidelines = false;
        this.showAggregationBullets = false;
        this.enableAnnotation = false;
        this.bulletDistanceThreshold = 0;
    }
}
exports.XYChartConfig = XYChartConfig;
