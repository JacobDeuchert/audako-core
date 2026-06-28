"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetAuditLogListConfig = exports.WidgetAuditLogListVersion = exports.SelectableEntitiesTranslation = exports.ObjectOperations = exports.EntityAction = exports.WidgetAuditLogListFilterType = void 0;
const shared_js_1 = require("./shared.js");
var WidgetAuditLogListFilterType;
(function (WidgetAuditLogListFilterType) {
    WidgetAuditLogListFilterType["Group"] = "Group";
    WidgetAuditLogListFilterType["Entity"] = "Entity";
})(WidgetAuditLogListFilterType || (exports.WidgetAuditLogListFilterType = WidgetAuditLogListFilterType = {}));
var EntityAction;
(function (EntityAction) {
    EntityAction[EntityAction["Add"] = 0] = "Add";
    EntityAction[EntityAction["Update"] = 1] = "Update";
    EntityAction[EntityAction["Delete"] = 2] = "Delete";
})(EntityAction || (exports.EntityAction = EntityAction = {}));
var ObjectOperations;
(function (ObjectOperations) {
    ObjectOperations["ResetCounter_1"] = "ResetCounter_1";
    ObjectOperations["Set"] = "Set";
    ObjectOperations["SetManualValue"] = "SetManualValue";
    ObjectOperations["SetNote"] = "SetNote";
    ObjectOperations["SetLive"] = "SetLive";
    ObjectOperations["SendConfig"] = "SendConfig";
    ObjectOperations["ImportHistoricalValues"] = "ImportHistoricalValues";
    ObjectOperations["HistoricalValueManipulation"] = "HistoricalValueManipulation";
    ObjectOperations["Deactivated"] = "Deactivated";
    ObjectOperations["Activated"] = "Activated";
    ObjectOperations["ResetBatchReview"] = "ResetBatchReview";
    ObjectOperations["LicenseRenewal"] = "LicenseRenewal";
})(ObjectOperations || (exports.ObjectOperations = ObjectOperations = {}));
var SelectableEntitiesTranslation;
(function (SelectableEntitiesTranslation) {
    SelectableEntitiesTranslation["Group"] = "GROUP";
    SelectableEntitiesTranslation["Signal"] = "SIGNAL";
    SelectableEntitiesTranslation["Formula"] = "FORMULA";
    SelectableEntitiesTranslation["Datasource"] = "DATASOURCE";
    SelectableEntitiesTranslation["DataConnection"] = "DATACONNECTION";
    SelectableEntitiesTranslation["Dashboard"] = "DASHBOARD";
    SelectableEntitiesTranslation["DashboardTab"] = "DASHBOARDTAB";
    SelectableEntitiesTranslation["ProcessImage"] = "PROCESSIMAGE";
    SelectableEntitiesTranslation["ReportTemplate"] = "REPORTTEMPLATE";
    SelectableEntitiesTranslation["Report"] = "REPORT";
    SelectableEntitiesTranslation["Camera"] = "CAMERA";
    SelectableEntitiesTranslation["SwitchSchedule"] = "SWITCHSCHEDULE";
    SelectableEntitiesTranslation["RecipientGroup"] = "RECIPIENTGROUP";
    SelectableEntitiesTranslation["Recipient"] = "RECIPIENT";
    SelectableEntitiesTranslation["AlarmingPlan"] = "ALARMINGPLAN";
    SelectableEntitiesTranslation["Role"] = "ROLE";
    SelectableEntitiesTranslation["Condition"] = "CONDITION";
    SelectableEntitiesTranslation["EventDefinition"] = "EVENTDEFINITION";
    SelectableEntitiesTranslation["EventCategory"] = "EVENTCATEGORY";
    SelectableEntitiesTranslation["BatchDefinition"] = "BATCHDEFINITION";
})(SelectableEntitiesTranslation || (exports.SelectableEntitiesTranslation = SelectableEntitiesTranslation = {}));
exports.WidgetAuditLogListVersion = '2';
class WidgetAuditLogListConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetAuditLogListVersion;
    }
}
exports.WidgetAuditLogListConfig = WidgetAuditLogListConfig;
