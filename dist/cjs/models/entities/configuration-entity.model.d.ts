export declare enum EntityType {
    Group = "Group",
    Signal = "Signal",
    Formula = "Formula",
    Dashboard = "Dashboard",
    DashboardTab = "DashboardTab",
    DataConnection = "DataConnection",
    DataSource = "DataSource",
    Connector = "Connector",
    EventCondition = "EventCondition",
    EventDefinition = "EventDefinition",
    EventCategory = "EventCategory",
    ProcessImage = "ProcessImage",
    BatchDefinition = "BatchDefinition",
    ReportTemplate = "ReportTemplate",
    Report = "Report",
    Document = "Document",
    Storage = "Storage",
    Camera = "Camera",
    SwitchSchedule = "SwitchSchedule",
    User = "User",
    Role = "Role",
    Recipient = "Recipient",
    RecipientGroup = "RecipientGroup",
    AlarmingPlan = "AlarmingPlan",
    MaintenanceService = "MaintenanceService",
    TaskDefinition = "TaskDefinition",
    RuntimeScript = "RuntimeScript"
}
export declare const EntityIcons: {
    [p in EntityType]?: string;
};
export declare const EntityHttpEndpoints: {
    [p in EntityType]: string;
};
export declare enum FieldObjectOrientationAttribute {
    Locked = "Locked",
    Overwritten = "Overwritten",
    FillInVariables = "FillInVariables",
    ResolveRelative = "ResolveRelative"
}
export declare enum EntityObjectOrientationAttribute {
    Locked = "Locked",
    Overwritten = "Overwritten"
}
export declare class Field<T> {
    Value: T;
    OOAttributes: FieldObjectOrientationAttribute[];
    constructor(value?: T, ooAttributes?: FieldObjectOrientationAttribute[]);
    static isField(value: any): value is Field<any>;
}
export declare class TranslatableField<T> extends Field<T> {
    Translations: {
        [language: string]: T;
    };
    constructor(value?: T, ooAttributes?: FieldObjectOrientationAttribute[]);
}
export declare abstract class ConfigurationEntity {
    Id: string;
    Path: string[];
    Name: TranslatableField<string>;
    Alias: Field<string>;
    Description: TranslatableField<string>;
    Tags: Field<string[]>;
    Version: number;
    AdditionalFields: {
        [p: string]: Field<string>;
    };
    GroupId: string;
    CreatedBy: string;
    CreatedOn: Date;
    ChangedBy?: string;
    ChangedOn?: Date;
    MaintenanceMode: boolean;
    IsInstanceOf?: string;
    IsTemplate: boolean;
    OOAttributes: EntityObjectOrientationAttribute[];
    constructor(options?: Partial<ConfigurationEntity>);
}
