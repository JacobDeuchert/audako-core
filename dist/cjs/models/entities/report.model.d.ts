import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum ReportStorageType {
    PDF = "PDF",
    CSV = "CSV",
    XLSX = "XLSX",
    DOCX = "DOCX",
    PNG = "PNG",
    JPG = "JPG"
}
export declare enum ReportItemElementType {
    Signal = "Signal",
    Formula = "Formula"
}
export declare enum ReportColumnType {
    AVG = "AVG",
    SUM = "SUM",
    MIN = "MIN",
    MAX = "MAX"
}
export declare enum ReportParameterType {
    TextBox = "TextBox",
    NumberBox = "NumberBox",
    RadioList = "RadioList",
    SelectList = "SelectList",
    Signal = "Signal",
    CheckBox = "CheckBox"
}
export declare class Report extends ConfigurationEntity {
    Title: Field<string>;
    Parameters: Field<{
        [key: string]: {
            [key: string]: any;
        };
    }>;
    Elements: Field<{
        [key: string]: ReportElement;
    }>;
    TimeZone: Field<string>;
    EventReportSettings: Field<EventReportSettings>;
    Templates: Field<string[]>;
    constructor();
}
export declare class ReportObject {
    ObjectType: Field<ReportItemElementType>;
    ObjectId: Field<string>;
}
export declare abstract class ReportTypedElement {
    _t: string;
    Caption: Field<string>;
    Alias: Field<string>;
    Parameters: Field<{
        [key: string]: string;
    }>;
    constructor(typeName?: string);
}
export declare class ReportCaptionElement extends ReportTypedElement {
    Elements: ReportTypedElement[];
    constructor();
}
export declare class ReportItemElement extends ReportTypedElement {
    Type: Field<ReportColumnType>;
    ObjectType: Field<ReportItemElementType>;
    ObjectId: Field<string>;
    constructor();
}
export declare class EventReportSettings {
    EventReports: EventReport[];
    constructor();
}
export declare class EventReport {
    Actions: EventAction[];
    EventId: string;
    Enabled: boolean;
    FileNameTemplate: string;
    OnDrop: boolean;
    OnRaise: boolean;
    TemplateId: string;
    StorageType: ReportStorageType;
    constructor();
}
export declare abstract class EventAction {
    _t: string;
    constructor(typeName?: string);
}
export declare class MailEventAction extends EventAction {
    EMailAddress: string;
    constructor();
}
export declare class StorageEventAction extends EventAction {
    Path: string;
    constructor();
}
export declare abstract class ReportElement {
    _t: string;
    AliasId: string;
    Label: string;
    constructor(typeName?: string);
}
export declare abstract class ReportElementSettings {
    _t: string;
    Label: string;
    constructor(typeName?: string);
}
export declare class ReportParameterDefinition {
    Key: string;
    Label: string;
    Type: string;
    DefaultValue: any;
    PossibleValues: {
        [key: string]: string;
    };
}
export declare class ReportGroup extends ReportElement {
    GroupElements: {
        [key: string]: ReportField;
    };
    constructor();
}
export declare class ReportGroupSettings extends ReportElementSettings {
    GroupElementSettings: {
        [key: string]: ReportFieldSettings;
    };
    constructor();
}
export declare class ReportList extends ReportElement {
    ListEntries: ReportElement[];
    constructor();
}
export declare class ReportListSettings extends ReportElementSettings {
    ListEntrySettings: ReportFieldSettings;
    constructor();
}
export declare class ReportField extends ReportElement {
    Settings: {
        [key: string]: {
            [key: string]: any;
        };
    };
    constructor();
}
export declare class ReportFieldSettings extends ReportElementSettings {
    Settings: ReportParameterDefinition[];
    constructor();
}
export declare class ReportTable extends ReportElement {
    TableEntries: ReportTableElement[];
    constructor();
}
export declare class ReportTableSettings extends ReportElementSettings {
    NumberOfColumns: number;
    NumberOfHeaders: number;
    EntrySettings: ReportParameterDefinition[];
    constructor();
}
export declare abstract class ReportTableElement {
    _t: string;
    Label: string;
    AdditionalSettings: {
        [key: string]: {
            [key: string]: any;
        };
    };
    constructor(typeName?: string);
}
export declare class ReportTableEntry extends ReportTableElement {
    constructor();
}
export declare class ReportTableHeader extends ReportTableElement {
    Elements: ReportTableElement[];
    constructor();
}
export declare class ReportSettings {
    GeneralSettings: ReportParameterDefinition[];
    ElementSettings: {
        [key: string]: ReportElementSettings;
    };
}
