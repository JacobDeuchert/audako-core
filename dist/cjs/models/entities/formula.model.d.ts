import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class Formula extends ConfigurationEntity {
    Type: Field<FormulaType>;
    SignalId: Field<string>;
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
    Variables: FormulaVariable[];
    constructor();
}
export declare class FormulaNumericSettings {
    DecimalPlaces: Field<number>;
    Unit: Field<string>;
    constructor();
}
export declare class FormulaVariable {
    VariableName: Field<string>;
    ObjectId: Field<string>;
    ObjectType: Field<VariableType>;
    ValueType: Field<FormulaValueType>;
    TagScope: Field<TagScope>;
    constructor();
}
export declare class FormulaIntervalSettings {
    Formula: Field<string>;
    ValueIntervalType: Field<ValueIntervalType | null>;
    CompressionType: Field<FormulaCompressionType>;
    ProvidePreValues: Field<boolean>;
    ProvideLastValues: Field<boolean>;
    constructor();
}
export declare enum ValueIntervalType {
    Standard = "Standard",
    ProcessInterval = "ProcessInterval",
    SubInterval = "SubInterval",
    HourInterval = "HourInterval",
    TwoHourInterval = "TwoHourInterval",
    DayInterval = "DayInterval",
    WeekInterval = "WeekInterval",
    MonthInterval = "MonthInterval",
    QuarterInterval = "QuarterInterval",
    YearInterval = "YearInterval"
}
export declare enum FormulaCompressionType {
    ArithmeticMean = "ArithmeticMean",
    Sum = "Sum"
}
export declare enum VariableType {
    Signal = "Signal",
    Formula = "Formula",
    Tag = "Tag"
}
export declare enum FormulaType {
    Numeric = "Numeric",
    Universal = "Universal"
}
export declare enum FormulaValueType {
    Normal = "Normal",
    Minimum = "Minimum",
    Maximum = "Maximum"
}
export declare enum TagScope {
    Global = "Global",
    Tenant = "Tenant",
    Group = "Group",
    GroupAndSubGroups = "GroupAndSubGroups"
}
export { FormulaCompressionType as CompressionType };
