import { CompressionInterval } from '../historical-value.model.js';
import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class Formula extends ConfigurationEntity {
    CalculateOnlyWithFullVariableSet: Field<boolean>;
    NumericSettings: FormulaNumericSettings;
    ProcessIntervalSettings: FormulaIntervalSettings;
    SubIntervalSettings: FormulaIntervalSettings;
    HourIntervalSettings: FormulaIntervalSettings;
    TwoHourIntervalSettings: FormulaIntervalSettings;
    DayIntervalSettings: FormulaIntervalSettings;
    WeekIntervalSettings: FormulaIntervalSettings;
    MonthIntervalSettings: FormulaIntervalSettings;
    QuarterIntervalSettings: FormulaIntervalSettings;
    YearIntervalSettings: FormulaIntervalSettings;
    constructor();
}
export declare class FormulaIntervalSettings {
    Formula: Field<string>;
    CompressionType: Field<CompressionType>;
    ProvidePreValues: Field<boolean>;
    ProvideLastValues: Field<boolean>;
    ValueIntervalType: Field<CompressionInterval | null>;
    constructor();
}
export declare class FormulaNumericSettings {
    DecimalPlaces: Field<number>;
    Unit: Field<string>;
    constructor();
}
export declare enum CompressionType {
    ArithmeticMean = "ArithmeticMean",
    Sum = "Sum"
}
