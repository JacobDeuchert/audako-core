export var SelectFieldType;
(function (SelectFieldType) {
    SelectFieldType["RadioBox"] = "RadioBox";
    SelectFieldType["DropDown"] = "DropDown";
})(SelectFieldType || (SelectFieldType = {}));
export class CustomFieldSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.DefaultValue = null;
        this.Multiple = false;
    }
}
export class NumberFieldSettings extends CustomFieldSettings {
    constructor() {
        super('NumberFieldSettings');
        this.DecimalPlaces = null;
        this.Unit = null;
        this.Min = null;
        this.Max = null;
        this.StepSize = null;
    }
}
export class TextFieldSettings extends CustomFieldSettings {
    constructor(typeName = 'TextFieldSettings') {
        super(typeName);
        this.MaxLength = null;
        this.ValidationRegex = null;
        this.Multiline = false;
    }
}
export class TextAreaFieldSettings extends TextFieldSettings {
    constructor() {
        super('TextAreaFieldSettings');
        this.Multiline = true;
    }
}
export class CheckboxFieldSettings extends CustomFieldSettings {
    constructor() {
        super('CheckboxFieldSettings');
    }
}
export class DateFieldSettings extends CustomFieldSettings {
    constructor() {
        super('DateFieldSettings');
    }
}
export class SelectFieldSettings extends CustomFieldSettings {
    constructor() {
        super('SelectFieldSettings');
        this.PossibleValues = [];
        this.Type = SelectFieldType.DropDown;
    }
}
export class EntityFieldSettings extends CustomFieldSettings {
    constructor() {
        super('EntityFieldSettings');
        this.EntityType = null;
    }
}
export class UserFieldSettings extends CustomFieldSettings {
    constructor() {
        super('UserFieldSettings');
    }
}
export class CustomMappingFieldSettings extends CustomFieldSettings {
    constructor() {
        super('CustomMappingFieldSettings');
        this.CustomMappingId = null;
    }
}
