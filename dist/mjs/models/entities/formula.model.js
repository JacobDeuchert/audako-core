import { ConfigurationEntity } from './configuration-entity.model.js';
export class Formula extends ConfigurationEntity {
}
export class FormulaIntervalSettings {
}
export class FormulaNumericSettings {
}
export var CompressionType;
(function (CompressionType) {
    CompressionType["ArithmeticMean"] = "ArithmeticMean";
    CompressionType["Sum"] = "Sum";
})(CompressionType || (CompressionType = {}));
