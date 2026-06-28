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

import { CompressionInterval } from '../historical-value.model.js';

// ---------------------------------------------------------------------------
// Base widget config
// ---------------------------------------------------------------------------

export abstract class BaseWidgetConfig {
  version: string;
  headerExpanded: boolean;
  title: string;

  constructor() {
    this.headerExpanded = false;
  }
}

export enum ValueEntityType {
  Signal = 'Signal',
  Formula = 'Formula',
}

export type ValueEntity = {
  id: string;
  type: ValueEntityType;
  valueInterval?: CompressionInterval;
};

// ---------------------------------------------------------------------------
// Time / observation settings
// ---------------------------------------------------------------------------

export class TimeManagementSettings {
  channels: string[];
  enabled: boolean;
  timecontrol: boolean;

  constructor() {
    this.channels = [];
    this.enabled = false;
    this.timecontrol = false;
  }
}

export enum ObservationPeriodUnits {
  Second = 'Second',
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Quarter = 'Quarter',
  Year = 'Year',
}

export class IntervalSettings {
  periodOfTime: ObservationPeriodUnits;
  amountOfTimePeriods: number;
  // 24 Hour, format hh:mm
  beginningOfaDay: string;
  beginningOfaWeek: number;

  // if offset period is not set but offsetOfTimePeriods is bigger than zero
  // we calculate the offset with the periodOfTime
  offsetPeriod?: ObservationPeriodUnits;
  offsetOfTimePeriods?: number;

  delayPeriod?: ObservationPeriodUnits;
  amountOfDelayPeriods?: number;

  constructor() {
    this.periodOfTime = ObservationPeriodUnits.Day;
    this.amountOfTimePeriods = 1;
    this.beginningOfaDay = '00:00';
    this.beginningOfaWeek = 1;
    this.offsetOfTimePeriods = 0;
  }
}

// ---------------------------------------------------------------------------
// Chart configuration (XY chart based widgets)
// ---------------------------------------------------------------------------

export type ISeriesLineType = 'Stroke' | 'Dashed' | 'Dotted';

export enum SeriesType {
  StepSeriesOptions = 'StepSeriesOptions',
  StepLineSeriesOptions = 'StepLineSeriesOptions',
  LineSeriesOptions = 'LineSeriesOptions',
  SmoothedLineSeriesOptions = 'SmoothedLineSeriesOptions',
  ColumnSeriesOptions = 'ColumnSeriesOptions',
}

export class SeriesOptions {
  seriesType: SeriesType;
  name: string;
  associateYAxis: string;
  bulletColor?: string;
  minBullet?: boolean;
  maxBullet?: boolean;
  averageBullet?: boolean;
  minRange?: boolean;
  maxRange?: boolean;
  averageRange?: boolean;
  axisRange?: boolean;
  color?: string;
  customLegend?: string;
  customUnit?: string;
  decimalPlaces?: number;
  tooltipDisabled?: boolean;
  thickness?: number;
  seriesLineType?: ISeriesLineType;
  showBullets?: boolean;
  valueY: string;
  valueX: string;
  hidden?: boolean;
}

export class StepLineSeriesOptions extends SeriesOptions {
  startLocation?: number;
}

export interface TensionOptions {
  tensionX?: number;
  tensionY?: number;
}

export class LineSeriesOptions extends SeriesOptions {
  tension: TensionOptions = { tensionX: 0.89, tensionY: 1 };
}

export class ColumnSeriesOptions extends SeriesOptions {
  renderInside?: boolean;
}

export class AxisOptions {
  name: string;
  label: string;
  color?: string;
  valueX: string;
  valueY: string;
  oppositeSide?: boolean;
}

export class GuidelineOptions {
  associatedAxis: string;
  width: number;
  color: string;
  label: string;
  value: number;
  aboveSeries: boolean;
}

export class ValueAxisOptions extends AxisOptions {
  unit: string;
  enabled?: boolean;
  decimalPlaces: number;
  inversed: boolean;
  axisPrecision: number;
  minimum?: number;
  maximum?: number;
  [propName: string]: any;

  constructor() {
    super();
    this.unit = '';
  }
}

export class XYChartConfig {
  title?: string;
  name?: string;
  hideName?: boolean;
  isMobile?: boolean;
  hideScrollBars?: boolean;
  hideHeadline?: boolean;
  yAxis: ValueAxisOptions[];
  enableScrollbar: boolean;
  enableScrollbarY: boolean;
  enableAnnotation: boolean;
  smallLegend: boolean;
  legend: boolean;
  tooltipDisabled: boolean;
  showAggregationBullets: boolean;
  showAggregationGuidelines: boolean;
  showTimeRange: boolean;
  series: SeriesOptions[];
  guidelines: GuidelineOptions[];
  bulletDistanceThreshold: number;

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
