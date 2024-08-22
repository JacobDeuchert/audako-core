import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class Formula extends ConfigurationEntity {
    constructor() {
        super();
        this.CalculateOnlyWithFullVariableSet = new Field(false);
        this.NumericSettings = new FormulaNumericSettings();
        this.ProcessIntervalSettings = new FormulaIntervalSettings();
        this.SubIntervalSettings = new FormulaIntervalSettings();
        this.HourIntervalSettings = new FormulaIntervalSettings();
        this.TwoHourIntervalSettings = new FormulaIntervalSettings();
        this.DayIntervalSettings = new FormulaIntervalSettings();
        this.WeekIntervalSettings = new FormulaIntervalSettings();
        this.MonthIntervalSettings = new FormulaIntervalSettings();
        this.QuarterIntervalSettings = new FormulaIntervalSettings();
        this.YearIntervalSettings = new FormulaIntervalSettings;
    }
}
export class FormulaIntervalSettings {
    constructor() {
        this.Formula = new Field();
        this.CompressionType = new Field(CompressionType.ArithmeticMean);
        this.ProvidePreValues = new Field(false);
        this.ProvideLastValues = new Field(false);
        this.ValueIntervalType = new Field(null);
    }
}
export class FormulaNumericSettings {
    constructor() {
        this.DecimalPlaces = new Field(3);
        this.Unit = new Field();
    }
}
export var CompressionType;
(function (CompressionType) {
    CompressionType["ArithmeticMean"] = "ArithmeticMean";
    CompressionType["Sum"] = "Sum";
})(CompressionType || (CompressionType = {}));
