import { BaseWidgetConfig } from './shared.js';

export const WidgetReportConfigVersion = '2';

export class WidgetReportConfig extends BaseWidgetConfig {
  reportId: string;
  TemplateTimeSteps: { [p: string]: TimeStepSize };
  startTemplate?: string;
  startOffset: number;

  constructor() {
    super();
    this.version = WidgetReportConfigVersion;
    this.TemplateTimeSteps = {};
  }
}

export enum TimeStepSize {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export const widgetReport_Name: string = 'WidgetReport';
