import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum ReportStorageType {
  PDF = 'PDF',
  CSV = 'CSV',
  XLSX = 'XLSX',
  DOCX = 'DOCX',
  PNG = 'PNG',
  JPG = 'JPG',
}

export enum ReportItemElementType {
  Signal = 'Signal',
  Formula = 'Formula',
}

export enum ReportColumnType {
  AVG = 'AVG',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
}

/**
 * `ReportParameterDefinition.Type` values the report scripts emit. The backend passes the string
 * through unchecked, so treat anything else as unknown. `Signal` and `Event` are references: their
 * `PossibleValues` keys are the selectable {@link ReportReferenceType}s and their value is stored as
 * {@link ReportReferenceValue}; all other types store a {@link ReportPlainValue}.
 */
export enum ReportParameterType {
  TextBox = 'TextBox',
  NumberBox = 'NumberBox',
  RadioList = 'RadioList',
  SelectList = 'SelectList',
  Signal = 'Signal',
  CheckBox = 'CheckBox',
  Event = 'Event',
}

/**
 * Entity type of a reference value. A `Signal` parameter offers `Signal` and usually `Formula`,
 * an `Event` parameter `Event` and `Condition`; the template lists the offered ones in
 * `PossibleValues`.
 */
export enum ReportReferenceType {
  Signal = 'Signal',
  Formula = 'Formula',
  Event = 'Event',
  Condition = 'Condition',
}

/** `_t` of the values in `ReportSettings.ElementSettings`. */
export enum ReportElementSettingsType {
  Field = 'ReportFieldSettings',
  Group = 'ReportGroupSettings',
  List = 'ReportListSettings',
  Table = 'ReportTableSettings',
}

/** `_t` of the values in `Report.Elements`. */
export enum ReportElementType {
  Field = 'ReportField',
  Group = 'ReportGroup',
  List = 'ReportList',
  Table = 'ReportTable',
}

/** `_t` of the rows in `ReportTable.TableEntries`. */
export enum ReportTableElementType {
  Entry = 'ReportTableEntry',
  Header = 'ReportTableHeader',
}

/**
 * Stored value of a non-reference parameter. The UI writes strings (CheckBox `'true'`/`'false'`,
 * NumberBox the typed text); an untouched parameter keeps the template's `DefaultValue` as is.
 */
export interface ReportPlainValue {
  value: any;
}

/** Stored value of a `Signal` or `Event` parameter. `id` is null until an entity is picked. */
export interface ReportReferenceValue {
  id: string | null;
  type: ReportReferenceType | (string & {}) | null;
}

/** Value of one parameter in `Report.Parameters`, `ReportField.Settings` or `ReportTableElement.AdditionalSettings`. */
export type ReportSettingValue = ReportPlainValue | ReportReferenceValue;

export function isReportReferenceValue(value: ReportSettingValue | null | undefined): value is ReportReferenceValue {
  return !!value && 'type' in value;
}

export class Report extends ConfigurationEntity {
  public Title: Field<string>;
  public Parameters: Field<{ [key: string]: { [key: string]: any } }>;
  public Elements: Field<{ [key: string]: ReportElement }>;
  public TimeZone: Field<string>;
  public EventReportSettings: Field<EventReportSettings>;
  public Templates: Field<string[]>;

  constructor() {
    super();
    this.Title = new Field<string>();
    this.Parameters = new Field<{ [key: string]: { [key: string]: any } }>();
    this.Elements = new Field<{ [key: string]: ReportElement }>({});
    this.Templates = new Field<string[]>([]);
    this.TimeZone = new Field<string>('CET');
    this.EventReportSettings = new Field<EventReportSettings>(new EventReportSettings());
  }
}

export class ReportObject {
  public ObjectType: Field<ReportItemElementType>;
  public ObjectId: Field<string>;
}

export abstract class ReportTypedElement {
  public _t: string;
  public Caption: Field<string>;
  public Alias: Field<string>;
  public Parameters: Field<{ [key: string]: string }>;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
    this.Caption = new Field<string>();
    this.Alias = new Field<string>();
    this.Parameters = new Field<{ [key: string]: string }>();
  }
}

export class ReportCaptionElement extends ReportTypedElement {
  public Elements: ReportTypedElement[];

  constructor() {
    super('ReportCaptionElement');
    this.Elements = [];
  }
}

export class ReportItemElement extends ReportTypedElement {
  public Type: Field<ReportColumnType>;
  public ObjectType: Field<ReportItemElementType>;
  public ObjectId: Field<string>;

  constructor() {
    super('ReportItemElement');
    this.Type = new Field<ReportColumnType>();
    this.ObjectType = new Field<ReportItemElementType>();
    this.ObjectId = new Field<string>();
  }
}

export class EventReportSettings {
  public EventReports: EventReport[];

  constructor() {
    this.EventReports = [];
  }
}

export class EventReport {
  public Actions: EventAction[];
  public EventId: string;
  public Enabled: boolean;
  public FileNameTemplate: string;
  public OnDrop: boolean;
  public OnRaise: boolean;
  public TemplateId: string;
  public StorageType: ReportStorageType;

  constructor() {
    this.Actions = [];
  }
}

export abstract class EventAction {
  public _t: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class MailEventAction extends EventAction {
  public EMailAddress: string;

  constructor() {
    super('MailEventAction');
  }
}

export class StorageEventAction extends EventAction {
  public Path: string;

  constructor() {
    super('StorageEventAction');
  }
}

export abstract class ReportElement {
  public _t: string;
  public AliasId: string;
  public Label: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export abstract class ReportElementSettings {
  public _t: string;
  public Label: string;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
  }
}

export class ReportParameterDefinition {
  public Key: string;
  public Label: string;
  public Type: ReportParameterType | (string & {});
  /** Initial value; for `Signal` / `Event` the preselected {@link ReportReferenceType}. */
  public DefaultValue: any;
  public PossibleValues: { [key: string]: string };
}

export class ReportGroup extends ReportElement {
  public GroupElements: { [key: string]: ReportField };

  constructor() {
    super('ReportGroup');
    this.GroupElements = {};
  }
}

export class ReportGroupSettings extends ReportElementSettings {
  public GroupElementSettings: { [key: string]: ReportFieldSettings };

  constructor() {
    super('ReportGroupSettings');
    this.GroupElementSettings = {};
  }
}

export class ReportList extends ReportElement {
  public ListEntries: ReportElement[];

  constructor() {
    super('ReportList');
    this.ListEntries = [];
  }
}

export class ReportListSettings extends ReportElementSettings {
  public ListEntrySettings: ReportFieldSettings;

  constructor() {
    super('ReportListSettings');
  }
}

export class ReportField extends ReportElement {
  public Settings: { [key: string]: { [key: string]: any } };

  constructor() {
    super('ReportField');
  }
}

export class ReportFieldSettings extends ReportElementSettings {
  public Settings: ReportParameterDefinition[];

  constructor() {
    super('ReportFieldSettings');
  }
}

export class ReportTable extends ReportElement {
  public TableEntries: ReportTableElement[];

  constructor() {
    super('ReportTable');
  }
}

export class ReportTableSettings extends ReportElementSettings {
  public NumberOfColumns: number;
  public NumberOfHeaders: number;
  public EntrySettings: ReportParameterDefinition[];

  constructor() {
    super('ReportTableSettings');
  }
}

export abstract class ReportTableElement {
  public _t: string;
  public Label: string;
  public AdditionalSettings: { [key: string]: { [key: string]: any } };

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
    this.AdditionalSettings = {};
  }
}

export class ReportTableEntry extends ReportTableElement {
  constructor() {
    super('ReportTableEntry');
  }
}

export class ReportTableHeader extends ReportTableElement {
  public Elements: ReportTableElement[];

  constructor() {
    super('ReportTableHeader');
  }
}

export class ReportSettings {
  public GeneralSettings: ReportParameterDefinition[];
  public ElementSettings: { [key: string]: ReportElementSettings };
}

/** `ReportSettings.ElementSettings` entry, narrowable on `_t`. */
export type AnyReportElementSettings =
  | (ReportFieldSettings & { _t: ReportElementSettingsType.Field })
  | (ReportGroupSettings & { _t: ReportElementSettingsType.Group })
  | (ReportListSettings & { _t: ReportElementSettingsType.List })
  | (ReportTableSettings & { _t: ReportElementSettingsType.Table });

/** `Report.Elements` entry, narrowable on `_t`. */
export type AnyReportElement =
  | (ReportField & { _t: ReportElementType.Field })
  | (ReportGroup & { _t: ReportElementType.Group })
  | (ReportList & { _t: ReportElementType.List })
  | (ReportTable & { _t: ReportElementType.Table });

/** `ReportTable.TableEntries` row, narrowable on `_t`. */
export type AnyReportTableElement =
  | (ReportTableEntry & { _t: ReportTableElementType.Entry })
  | (ReportTableHeader & { _t: ReportTableElementType.Header });
