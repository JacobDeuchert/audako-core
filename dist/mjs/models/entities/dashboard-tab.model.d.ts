import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class DashboardTab extends ConfigurationEntity {
    DashboardId: Field<string>;
    Content: Field<string>;
    MasterTabId: Field<string>;
    EntityMappings: Field<{
        [key: string]: DashboardTabEntity;
    }>;
    PlaceholderDefinition: Field<DashboardTabPlaceholder[]>;
    PlaceholderValues: Field<{
        [key: string]: string;
    }>;
    constructor();
}
export declare class DashboardTabPlaceholder {
    Name: string;
    PropertyId: string;
    DefaultValue: string;
}
export declare class DashboardTabEntity {
    EntityId: string;
    Type: string;
}
