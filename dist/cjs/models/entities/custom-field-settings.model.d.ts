export declare enum SelectFieldType {
    RadioBox = "RadioBox",
    DropDown = "DropDown"
}
export declare abstract class CustomFieldSettings {
    _t: string;
    DefaultValue: any;
    Multiple: boolean;
    constructor(typeName?: string);
}
export declare class NumberFieldSettings extends CustomFieldSettings {
    DecimalPlaces: number | null;
    Unit: string;
    Min: number | null;
    Max: number | null;
    StepSize: number | null;
    constructor();
}
export declare class TextFieldSettings extends CustomFieldSettings {
    MaxLength: number | null;
    ValidationRegex: string;
    Multiline: boolean;
    constructor(typeName?: string);
}
export declare class TextAreaFieldSettings extends TextFieldSettings {
    constructor();
}
export declare class CheckboxFieldSettings extends CustomFieldSettings {
    constructor();
}
export declare class DateFieldSettings extends CustomFieldSettings {
    constructor();
}
export declare class SelectFieldSettings extends CustomFieldSettings {
    PossibleValues: any[];
    Type: SelectFieldType;
    constructor();
}
export declare class EntityFieldSettings extends CustomFieldSettings {
    EntityType: string;
    constructor();
}
export declare class UserFieldSettings extends CustomFieldSettings {
    constructor();
}
export declare class CustomMappingFieldSettings extends CustomFieldSettings {
    CustomMappingId: string;
    constructor();
}
