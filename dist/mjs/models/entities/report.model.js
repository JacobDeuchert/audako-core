import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var ReportStorageType;
(function (ReportStorageType) {
    ReportStorageType["PDF"] = "PDF";
    ReportStorageType["CSV"] = "CSV";
    ReportStorageType["XLSX"] = "XLSX";
    ReportStorageType["DOCX"] = "DOCX";
    ReportStorageType["PNG"] = "PNG";
    ReportStorageType["JPG"] = "JPG";
})(ReportStorageType || (ReportStorageType = {}));
export var ReportItemElementType;
(function (ReportItemElementType) {
    ReportItemElementType["Signal"] = "Signal";
    ReportItemElementType["Formula"] = "Formula";
})(ReportItemElementType || (ReportItemElementType = {}));
export var ReportColumnType;
(function (ReportColumnType) {
    ReportColumnType["AVG"] = "AVG";
    ReportColumnType["SUM"] = "SUM";
    ReportColumnType["MIN"] = "MIN";
    ReportColumnType["MAX"] = "MAX";
})(ReportColumnType || (ReportColumnType = {}));
export var ReportParameterType;
(function (ReportParameterType) {
    ReportParameterType["TextBox"] = "TextBox";
    ReportParameterType["NumberBox"] = "NumberBox";
    ReportParameterType["RadioList"] = "RadioList";
    ReportParameterType["SelectList"] = "SelectList";
    ReportParameterType["Signal"] = "Signal";
    ReportParameterType["CheckBox"] = "CheckBox";
})(ReportParameterType || (ReportParameterType = {}));
export class Report extends ConfigurationEntity {
    constructor() {
        super();
        this.Title = new Field();
        this.Parameters = new Field();
        this.Elements = new Field({});
        this.Templates = new Field([]);
        this.TimeZone = new Field('CET');
        this.EventReportSettings = new Field(new EventReportSettings());
    }
}
export class ReportObject {
}
export class ReportTypedElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.Caption = new Field();
        this.Alias = new Field();
        this.Parameters = new Field();
    }
}
export class ReportCaptionElement extends ReportTypedElement {
    constructor() {
        super('ReportCaptionElement');
        this.Elements = [];
    }
}
export class ReportItemElement extends ReportTypedElement {
    constructor() {
        super('ReportItemElement');
        this.Type = new Field();
        this.ObjectType = new Field();
        this.ObjectId = new Field();
    }
}
export class EventReportSettings {
    constructor() {
        this.EventReports = [];
    }
}
export class EventReport {
    constructor() {
        this.Actions = [];
    }
}
export class EventAction {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class MailEventAction extends EventAction {
    constructor() {
        super('MailEventAction');
    }
}
export class StorageEventAction extends EventAction {
    constructor() {
        super('StorageEventAction');
    }
}
export class ReportElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class ReportElementSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
export class ReportParameterDefinition {
}
export class ReportGroup extends ReportElement {
    constructor() {
        super('ReportGroup');
        this.GroupElements = {};
    }
}
export class ReportGroupSettings extends ReportElementSettings {
    constructor() {
        super('ReportGroupSettings');
        this.GroupElementSettings = {};
    }
}
export class ReportList extends ReportElement {
    constructor() {
        super('ReportList');
        this.ListEntries = [];
    }
}
export class ReportListSettings extends ReportElementSettings {
    constructor() {
        super('ReportListSettings');
    }
}
export class ReportField extends ReportElement {
    constructor() {
        super('ReportField');
    }
}
export class ReportFieldSettings extends ReportElementSettings {
    constructor() {
        super('ReportFieldSettings');
    }
}
export class ReportTable extends ReportElement {
    constructor() {
        super('ReportTable');
    }
}
export class ReportTableSettings extends ReportElementSettings {
    constructor() {
        super('ReportTableSettings');
    }
}
export class ReportTableElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.AdditionalSettings = {};
    }
}
export class ReportTableEntry extends ReportTableElement {
    constructor() {
        super('ReportTableEntry');
    }
}
export class ReportTableHeader extends ReportTableElement {
    constructor() {
        super('ReportTableHeader');
    }
}
export class ReportSettings {
}
