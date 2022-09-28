import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum DataSourceType {
    S7 = "S7",
    ModBus = "ModBus"
}
export declare class DataConnection extends ConfigurationEntity {
    DataSourceId: Field<string>;
    Type: Field<DataSourceType>;
    Settings: DataConnectionSettings;
}
export declare class DataConnectionSettings {
    _t: string;
}
