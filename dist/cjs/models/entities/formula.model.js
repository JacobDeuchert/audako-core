"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionType = exports.FormulaNumericSettings = exports.FormulaIntervalSettings = exports.Formula = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Formula extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
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
        this.YearIntervalSettings = new FormulaIntervalSettings;
    }
}
exports.Formula = Formula;
class FormulaIntervalSettings {
    constructor() {
        this.Formula = new configuration_entity_model_js_1.Field();
        this.CompressionType = new configuration_entity_model_js_1.Field(CompressionType.ArithmeticMean);
        this.ProvidePreValues = new configuration_entity_model_js_1.Field(false);
        this.ProvideLastValues = new configuration_entity_model_js_1.Field(false);
        this.ValueIntervalType = new configuration_entity_model_js_1.Field(null);
    }
}
exports.FormulaIntervalSettings = FormulaIntervalSettings;
class FormulaNumericSettings {
    constructor() {
        this.DecimalPlaces = new configuration_entity_model_js_1.Field(3);
        this.Unit = new configuration_entity_model_js_1.Field();
    }
}
exports.FormulaNumericSettings = FormulaNumericSettings;
var CompressionType;
(function (CompressionType) {
    CompressionType["ArithmeticMean"] = "ArithmeticMean";
    CompressionType["Sum"] = "Sum";
})(CompressionType || (exports.CompressionType = CompressionType = {}));
