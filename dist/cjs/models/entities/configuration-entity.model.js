"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationEntity = exports.TranslatableField = exports.Field = exports.EntityObjectOrientationAttribute = exports.FieldObjectOrientationAttribute = exports.EntityHttpEndpoints = exports.EntityIcons = exports.EntityType = void 0;
var EntityType;
(function (EntityType) {
    EntityType["Group"] = "Group";
    EntityType["Signal"] = "Signal";
    EntityType["Formula"] = "Formula";
    EntityType["Dashboard"] = "Dashboard";
    EntityType["DashboardTab"] = "DashboardTab";
    EntityType["DataConnection"] = "DataConnection";
    EntityType["DataSource"] = "DataSource";
    EntityType["Connector"] = "Connector";
    EntityType["EventCondition"] = "EventCondition";
    EntityType["EventDefinition"] = "EventDefinition";
    EntityType["EventCategory"] = "EventCategory";
    EntityType["ProcessImage"] = "ProcessImage";
    EntityType["BatchDefinition"] = "BatchDefinition";
    EntityType["ReportTemplate"] = "ReportTemplate";
    EntityType["Report"] = "Report";
    EntityType["Document"] = "Document";
    EntityType["Storage"] = "Storage";
    EntityType["Camera"] = "Camera";
    EntityType["SwitchSchedule"] = "SwitchSchedule";
    EntityType["User"] = "User";
    EntityType["Role"] = "Role";
    EntityType["Recipient"] = "Recipient";
    EntityType["RecipientGroup"] = "RecipientGroup";
    EntityType["AlarmingPlan"] = "AlarmingPlan";
    EntityType["MaintenanceService"] = "MaintenanceService";
    EntityType["TaskDefinition"] = "TaskDefinition";
    EntityType["RuntimeScript"] = "RuntimeScript";
})(EntityType || (exports.EntityType = EntityType = {}));
exports.EntityIcons = {
    [EntityType.Group]: 'mat folder',
    [EntityType.Dashboard]: 'adk adk-dashboard',
    [EntityType.Signal]: 'mat code',
    [EntityType.Formula]: 'mat timeline',
    [EntityType.DataConnection]: 'mat data_usage',
    [EntityType.DataSource]: 'mat storage',
};
exports.EntityHttpEndpoints = {
    Group: '/base/Group',
    Signal: '/daq/Signal',
    Formula: '/daq/Formula',
    Dashboard: '/base/Dashboard',
    DashboardTab: '/base/DashboardTab',
    DataConnection: '/daq/DataConnection',
    DataSource: '/daq/DataSource',
    Connector: '/daq/Connector',
    EventCondition: '/base/condition',
    ProcessImage: '/scada/ProcessImage',
    EventCategory: '/base/EventCategory',
    EventDefinition: '/base/EventDefinition',
    BatchDefinition: '/scada/batchdefinition',
    ReportTemplate: '/scada/ReportTemplate',
    Report: '/scada/Report',
    Document: '/base/Document',
    Storage: '/base/Storage',
    Camera: '/scada/Camera',
    SwitchSchedule: '/scada/SwitchSchedule',
    User: '/base/User',
    Role: '/base/Role',
    Recipient: '/alarming/Recipient',
    RecipientGroup: '/alarming/RecipientGroup',
    AlarmingPlan: '/alarming/AlarmingPlan',
    MaintenanceService: '/maintenance/MaintenanceService',
    TaskDefinition: '/maintenance/TaskDefinition',
    RuntimeScript: '/runtime/RuntimeScript',
};
var FieldObjectOrientationAttribute;
(function (FieldObjectOrientationAttribute) {
    FieldObjectOrientationAttribute["Locked"] = "Locked";
    FieldObjectOrientationAttribute["Overwritten"] = "Overwritten";
    FieldObjectOrientationAttribute["FillInVariables"] = "FillInVariables";
    FieldObjectOrientationAttribute["ResolveRelative"] = "ResolveRelative";
})(FieldObjectOrientationAttribute || (exports.FieldObjectOrientationAttribute = FieldObjectOrientationAttribute = {}));
var EntityObjectOrientationAttribute;
(function (EntityObjectOrientationAttribute) {
    EntityObjectOrientationAttribute["Locked"] = "Locked";
    EntityObjectOrientationAttribute["Overwritten"] = "Overwritten";
})(EntityObjectOrientationAttribute || (exports.EntityObjectOrientationAttribute = EntityObjectOrientationAttribute = {}));
class Field {
    constructor(value = null, ooAttributes = []) {
        this.Value = value;
        this.OOAttributes = ooAttributes;
    }
    static isField(value) {
        return value && value.Value !== undefined;
    }
}
exports.Field = Field;
class TranslatableField extends Field {
    constructor(value = null, ooAttributes = []) {
        super(value, ooAttributes);
        this.Translations = {};
    }
}
exports.TranslatableField = TranslatableField;
class ConfigurationEntity {
    constructor(options) {
        this.Name = new TranslatableField();
        this.Alias = new Field();
        this.Description = new TranslatableField();
        this.Tags = new Field([]);
        this.Version = 0;
        this.AdditionalFields = {};
        this.Id = null;
        this.Path = [];
        this.GroupId = null;
        this.CreatedBy = null;
        this.CreatedOn = new Date();
        this.ChangedBy = null;
        this.ChangedOn = null;
        this.MaintenanceMode = false;
        this.IsInstanceOf = null;
        this.IsTemplate = false;
        this.OOAttributes = [];
        Object.assign(this, options);
    }
}
exports.ConfigurationEntity = ConfigurationEntity;
