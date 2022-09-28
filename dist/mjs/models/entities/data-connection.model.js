import { ConfigurationEntity } from './configuration-entity.model.js';
export var DataSourceType;
(function (DataSourceType) {
    DataSourceType["S7"] = "S7";
    DataSourceType["ModBus"] = "ModBus";
})(DataSourceType || (DataSourceType = {}));
export class DataConnection extends ConfigurationEntity {
}
export class DataConnectionSettings {
}
