import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class Formula extends ConfigurationEntity {
    constructor() {
        super();
        this.Variables = [];
        this.Type = new Field(FormulaType.Numeric);
        this.SignalId = new Field(null);
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
        this.YearIntervalSettings = new FormulaIntervalSettings();
    }
}
export class FormulaNumericSettings {
    constructor() {
        this.DecimalPlaces = new Field(0);
        this.Unit = new Field(null);
    }
}
export class FormulaVariable {
    constructor() {
        this.ValueType = new Field(FormulaValueType.Normal);
        this.VariableName = new Field(null);
        this.ObjectId = new Field(null);
        this.ObjectType = new Field(VariableType.Signal);
        this.TagScope = new Field(TagScope.Global);
    }
}
export class FormulaIntervalSettings {
    constructor() {
        this.Formula = new Field(null);
        this.ValueIntervalType = new Field(null);
        this.CompressionType = new Field(FormulaCompressionType.ArithmeticMean);
        this.ProvidePreValues = new Field(false);
        this.ProvideLastValues = new Field(false);
    }
}
export var ValueIntervalType;
(function (ValueIntervalType) {
    ValueIntervalType["Standard"] = "Standard";
    ValueIntervalType["ProcessInterval"] = "ProcessInterval";
    ValueIntervalType["SubInterval"] = "SubInterval";
    ValueIntervalType["HourInterval"] = "HourInterval";
    ValueIntervalType["TwoHourInterval"] = "TwoHourInterval";
    ValueIntervalType["DayInterval"] = "DayInterval";
    ValueIntervalType["WeekInterval"] = "WeekInterval";
    ValueIntervalType["MonthInterval"] = "MonthInterval";
    ValueIntervalType["QuarterInterval"] = "QuarterInterval";
    ValueIntervalType["YearInterval"] = "YearInterval";
})(ValueIntervalType || (ValueIntervalType = {}));
export var FormulaCompressionType;
(function (FormulaCompressionType) {
    FormulaCompressionType["ArithmeticMean"] = "ArithmeticMean";
    FormulaCompressionType["Sum"] = "Sum";
})(FormulaCompressionType || (FormulaCompressionType = {}));
export var VariableType;
(function (VariableType) {
    VariableType["Signal"] = "Signal";
    VariableType["Formula"] = "Formula";
    VariableType["Tag"] = "Tag";
})(VariableType || (VariableType = {}));
export var FormulaType;
(function (FormulaType) {
    FormulaType["Numeric"] = "Numeric";
    FormulaType["Universal"] = "Universal";
})(FormulaType || (FormulaType = {}));
export var FormulaValueType;
(function (FormulaValueType) {
    FormulaValueType["Normal"] = "Normal";
    FormulaValueType["Minimum"] = "Minimum";
    FormulaValueType["Maximum"] = "Maximum";
})(FormulaValueType || (FormulaValueType = {}));
export var TagScope;
(function (TagScope) {
    TagScope["Global"] = "Global";
    TagScope["Tenant"] = "Tenant";
    TagScope["Group"] = "Group";
    TagScope["GroupAndSubGroups"] = "GroupAndSubGroups";
})(TagScope || (TagScope = {}));
export { FormulaCompressionType as CompressionType };
