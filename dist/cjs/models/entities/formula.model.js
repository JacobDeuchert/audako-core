"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionType = exports.TagScope = exports.FormulaValueType = exports.FormulaType = exports.VariableType = exports.FormulaCompressionType = exports.ValueIntervalType = exports.FormulaIntervalSettings = exports.FormulaVariable = exports.FormulaNumericSettings = exports.Formula = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Formula extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Variables = [];
        this.Type = new configuration_entity_model_js_1.Field(FormulaType.Numeric);
        this.SignalId = new configuration_entity_model_js_1.Field(null);
        this.CalculateOnlyWithFullVariableSet = new configuration_entity_model_js_1.Field(false);
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
exports.Formula = Formula;
class FormulaNumericSettings {
    constructor() {
        this.DecimalPlaces = new configuration_entity_model_js_1.Field(0);
        this.Unit = new configuration_entity_model_js_1.Field(null);
    }
}
exports.FormulaNumericSettings = FormulaNumericSettings;
class FormulaVariable {
    constructor() {
        this.ValueType = new configuration_entity_model_js_1.Field(FormulaValueType.Normal);
        this.VariableName = new configuration_entity_model_js_1.Field(null);
        this.ObjectId = new configuration_entity_model_js_1.Field(null);
        this.ObjectType = new configuration_entity_model_js_1.Field(VariableType.Signal);
        this.TagScope = new configuration_entity_model_js_1.Field(TagScope.Global);
    }
}
exports.FormulaVariable = FormulaVariable;
class FormulaIntervalSettings {
    constructor() {
        this.Formula = new configuration_entity_model_js_1.Field(null);
        this.ValueIntervalType = new configuration_entity_model_js_1.Field(null);
        this.CompressionType = new configuration_entity_model_js_1.Field(FormulaCompressionType.ArithmeticMean);
        this.ProvidePreValues = new configuration_entity_model_js_1.Field(false);
        this.ProvideLastValues = new configuration_entity_model_js_1.Field(false);
    }
}
exports.FormulaIntervalSettings = FormulaIntervalSettings;
var ValueIntervalType;
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
})(ValueIntervalType || (exports.ValueIntervalType = ValueIntervalType = {}));
var FormulaCompressionType;
(function (FormulaCompressionType) {
    FormulaCompressionType["ArithmeticMean"] = "ArithmeticMean";
    FormulaCompressionType["Sum"] = "Sum";
})(FormulaCompressionType || (exports.CompressionType = exports.FormulaCompressionType = FormulaCompressionType = {}));
var VariableType;
(function (VariableType) {
    VariableType["Signal"] = "Signal";
    VariableType["Formula"] = "Formula";
    VariableType["Tag"] = "Tag";
})(VariableType || (exports.VariableType = VariableType = {}));
var FormulaType;
(function (FormulaType) {
    FormulaType["Numeric"] = "Numeric";
    FormulaType["Universal"] = "Universal";
})(FormulaType || (exports.FormulaType = FormulaType = {}));
var FormulaValueType;
(function (FormulaValueType) {
    FormulaValueType["Normal"] = "Normal";
    FormulaValueType["Minimum"] = "Minimum";
    FormulaValueType["Maximum"] = "Maximum";
})(FormulaValueType || (exports.FormulaValueType = FormulaValueType = {}));
var TagScope;
(function (TagScope) {
    TagScope["Global"] = "Global";
    TagScope["Tenant"] = "Tenant";
    TagScope["Group"] = "Group";
    TagScope["GroupAndSubGroups"] = "GroupAndSubGroups";
})(TagScope || (exports.TagScope = TagScope = {}));
