import { CompressionInterval } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';



export class Formula extends ConfigurationEntity {
  public CalculateOnlyWithFullVariableSet: Field<boolean>;

  public NumericSettings: FormulaNumericSettings;

  public ProcessIntervalSettings: FormulaIntervalSettings;
  public SubIntervalSettings: FormulaIntervalSettings;
  public HourIntervalSettings: FormulaIntervalSettings;
  public TwoHourIntervalSettings: FormulaIntervalSettings;
  public DayIntervalSettings: FormulaIntervalSettings;
  public WeekIntervalSettings: FormulaIntervalSettings;
  public MonthIntervalSettings: FormulaIntervalSettings;
  public QuarterIntervalSettings: FormulaIntervalSettings;
  public YearIntervalSettings: FormulaIntervalSettings;

}

export class FormulaIntervalSettings {
  public Formula: Field<string>;
  public CompressionType: Field<CompressionType>;

  public ProvidePreValues: Field<boolean>;

  public ValueIntervalType: Field<CompressionInterval | null>;
}

export class FormulaNumericSettings {
  public DecimalPlaces: Field<number>;
  public Unit:  Field<string>;

}


export enum CompressionType {
  ArithmeticMean = 'ArithmeticMean',
  Sum = 'Sum',
}