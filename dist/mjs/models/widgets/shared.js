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
// ---------------------------------------------------------------------------
// Base widget config
// ---------------------------------------------------------------------------
export class BaseWidgetConfig {
    constructor() {
        this.headerExpanded = false;
    }
}
export var ValueEntityType;
(function (ValueEntityType) {
    ValueEntityType["Signal"] = "Signal";
    ValueEntityType["Formula"] = "Formula";
})(ValueEntityType || (ValueEntityType = {}));
// ---------------------------------------------------------------------------
// Time / observation settings
// ---------------------------------------------------------------------------
export class TimeManagementSettings {
    constructor() {
        this.channels = [];
        this.enabled = false;
        this.timecontrol = false;
    }
}
export var ObservationPeriodUnits;
(function (ObservationPeriodUnits) {
    ObservationPeriodUnits["Second"] = "Second";
    ObservationPeriodUnits["Minute"] = "Minute";
    ObservationPeriodUnits["Hour"] = "Hour";
    ObservationPeriodUnits["Day"] = "Day";
    ObservationPeriodUnits["Week"] = "Week";
    ObservationPeriodUnits["Month"] = "Month";
    ObservationPeriodUnits["Quarter"] = "Quarter";
    ObservationPeriodUnits["Year"] = "Year";
})(ObservationPeriodUnits || (ObservationPeriodUnits = {}));
export class IntervalSettings {
    constructor() {
        this.periodOfTime = ObservationPeriodUnits.Day;
        this.amountOfTimePeriods = 1;
        this.beginningOfaDay = '00:00';
        this.beginningOfaWeek = 1;
        this.offsetOfTimePeriods = 0;
    }
}
export var SeriesType;
(function (SeriesType) {
    SeriesType["StepSeriesOptions"] = "StepSeriesOptions";
    SeriesType["StepLineSeriesOptions"] = "StepLineSeriesOptions";
    SeriesType["LineSeriesOptions"] = "LineSeriesOptions";
    SeriesType["SmoothedLineSeriesOptions"] = "SmoothedLineSeriesOptions";
    SeriesType["ColumnSeriesOptions"] = "ColumnSeriesOptions";
})(SeriesType || (SeriesType = {}));
export class SeriesOptions {
}
export class StepLineSeriesOptions extends SeriesOptions {
}
export class LineSeriesOptions extends SeriesOptions {
    constructor() {
        super(...arguments);
        this.tension = { tensionX: 0.89, tensionY: 1 };
    }
}
export class ColumnSeriesOptions extends SeriesOptions {
}
export class AxisOptions {
}
export class GuidelineOptions {
}
export class ValueAxisOptions extends AxisOptions {
    constructor() {
        super();
        this.unit = '';
    }
}
export class XYChartConfig {
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
