import { BaseWidgetConfig } from './shared.js';

export const WidgetManualDataConfigVersion = '4';

export class WidgetManualDataConfig extends BaseWidgetConfig {
  acquisitionInterval: AcquisitionInterval;

  acquisitionUnit: AcquisitionUnit;

  manualDataSignalMasks: ManualDataSignalMask[];

  additionalOptions: Object;

  /**
   * The amount of previous values to show when a text field is active
   * @access public
   * @property {number} previousValues
   */
  previousValues: number;

  /**
   * The selected timeline option (enabled, disabled, auto)
   * @access   public
   * @property {TimelineOptions} timelineOption
   */
  timelineOption: TimelineOptions;
  showStatusIcons: boolean;
  showAlias: boolean;
  showPreviousDefault: boolean;
  showPreviousPermanent: boolean;
  autoSaveAndNext: boolean;

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

export enum AcquisitionInterval {
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export enum AcquisitionUnit {
  ProcessValues = 'ProcessValues',
  HourValues = 'HourValues',
  DayValues = 'DayValues',
  WeekValues = 'WeekValues',
  MonthValues = 'MonthValues',
  YearValues = 'YearValues',
}

export interface ManualDataSignalMask {
  unit: string;
  label: string;
  signalId: string;
  decimalPlaces: number;
}

export enum TimelineOptions {
  ENABLED = '0',
  DISABLED = '1',
  AUTO = '2',
}
