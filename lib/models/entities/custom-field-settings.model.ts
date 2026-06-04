export enum SelectFieldType {
  RadioBox = 'RadioBox',
  DropDown = 'DropDown',
}

export abstract class CustomFieldSettings {
  public _t: string;
  public DefaultValue: any;
  public Multiple: boolean;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
    this.DefaultValue = null;
    this.Multiple = false;
  }
}

export class NumberFieldSettings extends CustomFieldSettings {
  public DecimalPlaces: number | null;
  public Unit: string;
  public Min: number | null;
  public Max: number | null;
  public StepSize: number | null;

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
  public MaxLength: number | null;
  public ValidationRegex: string;
  public Multiline: boolean;

  constructor(typeName: string = 'TextFieldSettings') {
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
  public PossibleValues: any[];
  public Type: SelectFieldType;

  constructor() {
    super('SelectFieldSettings');
    this.PossibleValues = [];
    this.Type = SelectFieldType.DropDown;
  }
}

export class EntityFieldSettings extends CustomFieldSettings {
  public EntityType: string;

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
  public CustomMappingId: string;

  constructor() {
    super('CustomMappingFieldSettings');
    this.CustomMappingId = null;
  }
}
