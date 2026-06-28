import { BaseWidgetConfig } from './shared.js';
export var WidgetAuditLogListFilterType;
(function (WidgetAuditLogListFilterType) {
    WidgetAuditLogListFilterType["Group"] = "Group";
    WidgetAuditLogListFilterType["Entity"] = "Entity";
})(WidgetAuditLogListFilterType || (WidgetAuditLogListFilterType = {}));
export var EntityAction;
(function (EntityAction) {
    EntityAction[EntityAction["Add"] = 0] = "Add";
    EntityAction[EntityAction["Update"] = 1] = "Update";
    EntityAction[EntityAction["Delete"] = 2] = "Delete";
})(EntityAction || (EntityAction = {}));
export var ObjectOperations;
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
})(ObjectOperations || (ObjectOperations = {}));
export var SelectableEntitiesTranslation;
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
})(SelectableEntitiesTranslation || (SelectableEntitiesTranslation = {}));
export const WidgetAuditLogListVersion = '2';
export class WidgetAuditLogListConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetAuditLogListVersion;
    }
}
