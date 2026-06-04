"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMappingFieldSettings = exports.UserFieldSettings = exports.EntityFieldSettings = exports.SelectFieldSettings = exports.DateFieldSettings = exports.CheckboxFieldSettings = exports.TextAreaFieldSettings = exports.TextFieldSettings = exports.NumberFieldSettings = exports.CustomFieldSettings = exports.SelectFieldType = void 0;
var SelectFieldType;
(function (SelectFieldType) {
    SelectFieldType["RadioBox"] = "RadioBox";
    SelectFieldType["DropDown"] = "DropDown";
})(SelectFieldType || (exports.SelectFieldType = SelectFieldType = {}));
class CustomFieldSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.DefaultValue = null;
        this.Multiple = false;
    }
}
exports.CustomFieldSettings = CustomFieldSettings;
class NumberFieldSettings extends CustomFieldSettings {
    constructor() {
        super('NumberFieldSettings');
        this.DecimalPlaces = null;
        this.Unit = null;
        this.Min = null;
        this.Max = null;
        this.StepSize = null;
    }
}
exports.NumberFieldSettings = NumberFieldSettings;
class TextFieldSettings extends CustomFieldSettings {
    constructor(typeName = 'TextFieldSettings') {
        super(typeName);
        this.MaxLength = null;
        this.ValidationRegex = null;
        this.Multiline = false;
    }
}
exports.TextFieldSettings = TextFieldSettings;
class TextAreaFieldSettings extends TextFieldSettings {
    constructor() {
        super('TextAreaFieldSettings');
        this.Multiline = true;
    }
}
exports.TextAreaFieldSettings = TextAreaFieldSettings;
class CheckboxFieldSettings extends CustomFieldSettings {
    constructor() {
        super('CheckboxFieldSettings');
    }
}
exports.CheckboxFieldSettings = CheckboxFieldSettings;
class DateFieldSettings extends CustomFieldSettings {
    constructor() {
        super('DateFieldSettings');
    }
}
exports.DateFieldSettings = DateFieldSettings;
class SelectFieldSettings extends CustomFieldSettings {
    constructor() {
        super('SelectFieldSettings');
        this.PossibleValues = [];
        this.Type = SelectFieldType.DropDown;
    }
}
exports.SelectFieldSettings = SelectFieldSettings;
class EntityFieldSettings extends CustomFieldSettings {
    constructor() {
        super('EntityFieldSettings');
        this.EntityType = null;
    }
}
exports.EntityFieldSettings = EntityFieldSettings;
class UserFieldSettings extends CustomFieldSettings {
    constructor() {
        super('UserFieldSettings');
    }
}
exports.UserFieldSettings = UserFieldSettings;
class CustomMappingFieldSettings extends CustomFieldSettings {
    constructor() {
        super('CustomMappingFieldSettings');
        this.CustomMappingId = null;
    }
}
exports.CustomMappingFieldSettings = CustomMappingFieldSettings;
