import { BaseWidgetConfig } from './shared.js';
export declare enum WidgetAuditLogListFilterType {
    Group = "Group",
    Entity = "Entity"
}
export declare enum EntityAction {
    Add = 0,
    Update = 1,
    Delete = 2
}
export declare enum ObjectOperations {
    ResetCounter_1 = "ResetCounter_1",
    Set = "Set",
    SetManualValue = "SetManualValue",
    SetNote = "SetNote",
    SetLive = "SetLive",
    SendConfig = "SendConfig",
    ImportHistoricalValues = "ImportHistoricalValues",
    HistoricalValueManipulation = "HistoricalValueManipulation",
    Deactivated = "Deactivated",
    Activated = "Activated",
    ResetBatchReview = "ResetBatchReview",
    LicenseRenewal = "LicenseRenewal"
}
export declare enum SelectableEntitiesTranslation {
    Group = "GROUP",
    Signal = "SIGNAL",
    Formula = "FORMULA",
    Datasource = "DATASOURCE",
    DataConnection = "DATACONNECTION",
    Dashboard = "DASHBOARD",
    DashboardTab = "DASHBOARDTAB",
    ProcessImage = "PROCESSIMAGE",
    ReportTemplate = "REPORTTEMPLATE",
    Report = "REPORT",
    Camera = "CAMERA",
    SwitchSchedule = "SWITCHSCHEDULE",
    RecipientGroup = "RECIPIENTGROUP",
    Recipient = "RECIPIENT",
    AlarmingPlan = "ALARMINGPLAN",
    Role = "ROLE",
    Condition = "CONDITION",
    EventDefinition = "EVENTDEFINITION",
    EventCategory = "EVENTCATEGORY",
    BatchDefinition = "BATCHDEFINITION"
}
export declare const WidgetAuditLogListVersion = "2";
export declare class WidgetAuditLogListConfig extends BaseWidgetConfig {
    selectedFilter: WidgetAuditLogListFilterType;
    selectedEntities: string[] | {
        [key: string]: string[];
    };
    selectedEntityTypes: string[];
    selectedHiddenEntityTypes: string[];
    withSubGroups: boolean;
    constructor();
}
