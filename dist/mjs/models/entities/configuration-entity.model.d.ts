export declare enum EntityType {
    Group = "Group",
    Signal = "Signal",
    Formula = "Formula",
    Dashboard = "Dashboard",
    DashboardTab = "DashboardTab",
    DataConnection = "DataConnection",
    DataSource = "DataSource",
    EventCondition = "EventCondition",
    EventDefinition = "EventDefinition",
    EventCategory = "EventCategory",
    ProcessImage = "ProcessImage"
}
export declare const EntityIcons: {
    [p in EntityType]?: string;
};
export declare const EntityHttpEndpoints: {
    [p in EntityType]: string;
};
export declare class Field<T> {
    Value: T;
    OOAttributes: string[];
    constructor(value?: T, ooAttributes?: string[]);
}
export declare abstract class ConfigurationEntity {
    Id: string;
    Path: string[];
    Name: Field<string>;
    Description: Field<string>;
    AdditionalFields: {
        [p: string]: Field<string>;
    };
    GroupId: string;
    CreatedBy: string;
    CreatedOn: Date;
    ChangedBy?: string;
    ChangedOn?: Date;
    IsInstanceOf?: string;
    IsTemplate: boolean;
    constructor(options?: Partial<ConfigurationEntity>);
}
