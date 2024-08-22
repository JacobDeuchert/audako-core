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

  constructor() {
    super();

    this.CalculateOnlyWithFullVariableSet = new Field<boolean>(false);
    this.NumericSettings = new FormulaNumericSettings();
    this.ProcessIntervalSettings = new FormulaIntervalSettings();
    this.SubIntervalSettings = new FormulaIntervalSettings();
    this.HourIntervalSettings = new FormulaIntervalSettings();
    this.TwoHourIntervalSettings = new FormulaIntervalSettings();
    this.DayIntervalSettings = new FormulaIntervalSettings();
    this.WeekIntervalSettings = new FormulaIntervalSettings();
    this.MonthIntervalSettings = new FormulaIntervalSettings();
    this.QuarterIntervalSettings = new FormulaIntervalSettings();
    this.YearIntervalSettings = new FormulaIntervalSettings
  }



}

export class FormulaIntervalSettings {
  public Formula: Field<string>;
  public CompressionType: Field<CompressionType>;

  public ProvidePreValues: Field<boolean>;
  public ProvideLastValues: Field<boolean>;

  public ValueIntervalType: Field<CompressionInterval | null>;

  constructor() {
    this.Formula = new Field<string>();
    this.CompressionType = new Field<CompressionType>(CompressionType.ArithmeticMean);
    this.ProvidePreValues = new Field<boolean>(false);
    this.ProvideLastValues = new Field<boolean>(false);
    this.ValueIntervalType = new Field<CompressionInterval | null>(null);
  }
}

export class FormulaNumericSettings {
  public DecimalPlaces: Field<number>;
  public Unit:  Field<string>;

  constructor() {
    this.DecimalPlaces = new Field<number>(3);
    this.Unit = new Field<string>();
  }

}


export enum CompressionType {
  ArithmeticMean = 'ArithmeticMean',
  Sum = 'Sum',
}