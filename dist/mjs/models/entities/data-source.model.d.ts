import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum DataSourceType {
    EdgeGateway = "EdgeGateway",
    DataAdapter = "DataAdapter",
    SmartDevice = "SmartDevice"
}
export declare class DataSource extends ConfigurationEntity {
    Address: Field<string>;
    Password: Field<string>;
    Type: Field<DataSourceType>;
    PermaLiveModeSettings: PermaLiveModeSettings;
    constructor();
}
export declare class PermaLiveModeSettings {
    Enabled: Field<boolean>;
    BlockingTime: Field<number>;
    constructor();
}
