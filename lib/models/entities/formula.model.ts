import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class Formula extends ConfigurationEntity {
  public Type: Field<FormulaType>;
  public SignalId: Field<string>;
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

  public Variables: FormulaVariable[];

  constructor() {
    super();

    this.Variables = [];
    this.Type = new Field<FormulaType>(FormulaType.Numeric);
    this.SignalId = new Field<string>(null);
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
    this.YearIntervalSettings = new FormulaIntervalSettings();
  }
}

export class FormulaNumericSettings {
  public DecimalPlaces: Field<number>;
  public Unit: Field<string>;

  constructor() {
    this.DecimalPlaces = new Field<number>(0);
    this.Unit = new Field<string>(null);
  }
}

export class FormulaVariable {
  public VariableName: Field<string>;
  public ObjectId: Field<string>;
  public ObjectType: Field<VariableType>;
  public ValueType: Field<FormulaValueType>;
  public TagScope: Field<TagScope>;

  constructor() {
    this.ValueType = new Field<FormulaValueType>(FormulaValueType.Normal);
    this.VariableName = new Field<string>(null);
    this.ObjectId = new Field<string>(null);
    this.ObjectType = new Field<VariableType>(VariableType.Signal);
    this.TagScope = new Field<TagScope>(TagScope.Global);
  }
}

export class FormulaIntervalSettings {
  public Formula: Field<string>;
  public ValueIntervalType: Field<ValueIntervalType | null>;
  public CompressionType: Field<FormulaCompressionType>;
  public ProvidePreValues: Field<boolean>;
  public ProvideLastValues: Field<boolean>;

  constructor() {
    this.Formula = new Field<string>(null);
    this.ValueIntervalType = new Field<ValueIntervalType | null>(null);
    this.CompressionType = new Field<FormulaCompressionType>(FormulaCompressionType.ArithmeticMean);
    this.ProvidePreValues = new Field<boolean>(false);
    this.ProvideLastValues = new Field<boolean>(false);
  }
}

export enum ValueIntervalType {
  Standard = 'Standard',
  ProcessInterval = 'ProcessInterval',
  SubInterval = 'SubInterval',
  HourInterval = 'HourInterval',
  TwoHourInterval = 'TwoHourInterval',
  DayInterval = 'DayInterval',
  WeekInterval = 'WeekInterval',
  MonthInterval = 'MonthInterval',
  QuarterInterval = 'QuarterInterval',
  YearInterval = 'YearInterval',
}

export enum FormulaCompressionType {
  ArithmeticMean = 'ArithmeticMean',
  Sum = 'Sum',
}

export enum VariableType {
  Signal = 'Signal',
  Formula = 'Formula',
  Tag = 'Tag',
}

export enum FormulaType {
  Numeric = 'Numeric',
  Universal = 'Universal',
}

export enum FormulaValueType {
  Normal = 'Normal',
  Minimum = 'Minimum',
  Maximum = 'Maximum',
}

export enum TagScope {
  Global = 'Global',
  Tenant = 'Tenant',
  Group = 'Group',
  GroupAndSubGroups = 'GroupAndSubGroups',
}

export { FormulaCompressionType as CompressionType };
