"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionType = exports.FormulaNumericSettings = exports.FormulaIntervalSettings = exports.Formula = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Formula extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.Formula = Formula;
class FormulaIntervalSettings {
}
exports.FormulaIntervalSettings = FormulaIntervalSettings;
class FormulaNumericSettings {
}
exports.FormulaNumericSettings = FormulaNumericSettings;
var CompressionType;
(function (CompressionType) {
    CompressionType["ArithmeticMean"] = "ArithmeticMean";
    CompressionType["Sum"] = "Sum";
})(CompressionType = exports.CompressionType || (exports.CompressionType = {}));
