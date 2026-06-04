import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class MaintenanceService extends ConfigurationEntity {
    Category: Field<string>;
    Enabled: Field<boolean>;
    Trigger: Field<string[]>;
    MaintenanceTasks: Field<string[]>;
    constructor();
}
