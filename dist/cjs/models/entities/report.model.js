"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSettings = exports.ReportTableHeader = exports.ReportTableEntry = exports.ReportTableElement = exports.ReportTableSettings = exports.ReportTable = exports.ReportFieldSettings = exports.ReportField = exports.ReportListSettings = exports.ReportList = exports.ReportGroupSettings = exports.ReportGroup = exports.ReportParameterDefinition = exports.ReportElementSettings = exports.ReportElement = exports.StorageEventAction = exports.MailEventAction = exports.EventAction = exports.EventReport = exports.EventReportSettings = exports.ReportItemElement = exports.ReportCaptionElement = exports.ReportTypedElement = exports.ReportObject = exports.Report = exports.ReportParameterType = exports.ReportColumnType = exports.ReportItemElementType = exports.ReportStorageType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var ReportStorageType;
(function (ReportStorageType) {
    ReportStorageType["PDF"] = "PDF";
    ReportStorageType["CSV"] = "CSV";
    ReportStorageType["XLSX"] = "XLSX";
    ReportStorageType["DOCX"] = "DOCX";
    ReportStorageType["PNG"] = "PNG";
    ReportStorageType["JPG"] = "JPG";
})(ReportStorageType || (exports.ReportStorageType = ReportStorageType = {}));
var ReportItemElementType;
(function (ReportItemElementType) {
    ReportItemElementType["Signal"] = "Signal";
    ReportItemElementType["Formula"] = "Formula";
})(ReportItemElementType || (exports.ReportItemElementType = ReportItemElementType = {}));
var ReportColumnType;
(function (ReportColumnType) {
    ReportColumnType["AVG"] = "AVG";
    ReportColumnType["SUM"] = "SUM";
    ReportColumnType["MIN"] = "MIN";
    ReportColumnType["MAX"] = "MAX";
})(ReportColumnType || (exports.ReportColumnType = ReportColumnType = {}));
var ReportParameterType;
(function (ReportParameterType) {
    ReportParameterType["TextBox"] = "TextBox";
    ReportParameterType["NumberBox"] = "NumberBox";
    ReportParameterType["RadioList"] = "RadioList";
    ReportParameterType["SelectList"] = "SelectList";
    ReportParameterType["Signal"] = "Signal";
    ReportParameterType["CheckBox"] = "CheckBox";
})(ReportParameterType || (exports.ReportParameterType = ReportParameterType = {}));
class Report extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Title = new configuration_entity_model_js_1.Field();
        this.Parameters = new configuration_entity_model_js_1.Field();
        this.Elements = new configuration_entity_model_js_1.Field({});
        this.Templates = new configuration_entity_model_js_1.Field([]);
        this.TimeZone = new configuration_entity_model_js_1.Field('CET');
        this.EventReportSettings = new configuration_entity_model_js_1.Field(new EventReportSettings());
    }
}
exports.Report = Report;
class ReportObject {
}
exports.ReportObject = ReportObject;
class ReportTypedElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.Caption = new configuration_entity_model_js_1.Field();
        this.Alias = new configuration_entity_model_js_1.Field();
        this.Parameters = new configuration_entity_model_js_1.Field();
    }
}
exports.ReportTypedElement = ReportTypedElement;
class ReportCaptionElement extends ReportTypedElement {
    constructor() {
        super('ReportCaptionElement');
        this.Elements = [];
    }
}
exports.ReportCaptionElement = ReportCaptionElement;
class ReportItemElement extends ReportTypedElement {
    constructor() {
        super('ReportItemElement');
        this.Type = new configuration_entity_model_js_1.Field();
        this.ObjectType = new configuration_entity_model_js_1.Field();
        this.ObjectId = new configuration_entity_model_js_1.Field();
    }
}
exports.ReportItemElement = ReportItemElement;
class EventReportSettings {
    constructor() {
        this.EventReports = [];
    }
}
exports.EventReportSettings = EventReportSettings;
class EventReport {
    constructor() {
        this.Actions = [];
    }
}
exports.EventReport = EventReport;
class EventAction {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.EventAction = EventAction;
class MailEventAction extends EventAction {
    constructor() {
        super('MailEventAction');
    }
}
exports.MailEventAction = MailEventAction;
class StorageEventAction extends EventAction {
    constructor() {
        super('StorageEventAction');
    }
}
exports.StorageEventAction = StorageEventAction;
class ReportElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.ReportElement = ReportElement;
class ReportElementSettings {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
    }
}
exports.ReportElementSettings = ReportElementSettings;
class ReportParameterDefinition {
}
exports.ReportParameterDefinition = ReportParameterDefinition;
class ReportGroup extends ReportElement {
    constructor() {
        super('ReportGroup');
        this.GroupElements = {};
    }
}
exports.ReportGroup = ReportGroup;
class ReportGroupSettings extends ReportElementSettings {
    constructor() {
        super('ReportGroupSettings');
        this.GroupElementSettings = {};
    }
}
exports.ReportGroupSettings = ReportGroupSettings;
class ReportList extends ReportElement {
    constructor() {
        super('ReportList');
        this.ListEntries = [];
    }
}
exports.ReportList = ReportList;
class ReportListSettings extends ReportElementSettings {
    constructor() {
        super('ReportListSettings');
    }
}
exports.ReportListSettings = ReportListSettings;
class ReportField extends ReportElement {
    constructor() {
        super('ReportField');
    }
}
exports.ReportField = ReportField;
class ReportFieldSettings extends ReportElementSettings {
    constructor() {
        super('ReportFieldSettings');
    }
}
exports.ReportFieldSettings = ReportFieldSettings;
class ReportTable extends ReportElement {
    constructor() {
        super('ReportTable');
    }
}
exports.ReportTable = ReportTable;
class ReportTableSettings extends ReportElementSettings {
    constructor() {
        super('ReportTableSettings');
    }
}
exports.ReportTableSettings = ReportTableSettings;
class ReportTableElement {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.AdditionalSettings = {};
    }
}
exports.ReportTableElement = ReportTableElement;
class ReportTableEntry extends ReportTableElement {
    constructor() {
        super('ReportTableEntry');
    }
}
exports.ReportTableEntry = ReportTableEntry;
class ReportTableHeader extends ReportTableElement {
    constructor() {
        super('ReportTableHeader');
    }
}
exports.ReportTableHeader = ReportTableHeader;
class ReportSettings {
}
exports.ReportSettings = ReportSettings;
