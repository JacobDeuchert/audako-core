import { EntityType } from './entities/configuration-entity.model.js';

export enum CompressionInterval {
  ProcessInterval = 'ProcessInterval',
  SubInterval = 'SubInterval',
  HourInterval = 'HourInterval',
  TwoHourInterval = 'TwoHourInterval',
  DayInterval = 'DayInterval',
  WeekInterval = 'WeekInterval',
  MonthInterval = 'MonthInterval',
  QuarterInterval = 'QuarterInterval',
  YearInterval = 'YearInterval'
}

export enum MeasurementValueSource {
  System = 'System',
  Process = 'Process',
  Import = 'Import',
  Manual = 'Manual',
  Mixed = 'Mixed',
  Manipulated = 'Manipulated',
}

export type ValueObjectType = EntityType.Signal | EntityType.Formula;


export type HistoricalValueMap = {IntervalStart: string}  & {[signalId: string]: number | string | boolean};
