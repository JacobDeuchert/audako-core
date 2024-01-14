import { ConfigurationEntity } from './configuration-entity.model.js';
export var DataSourceType;
(function (DataSourceType) {
    DataSourceType["EdgeGateway"] = "EdgeGateway";
    DataSourceType["DataAdapter"] = "DataAdapter";
    DataSourceType["SmartDevice"] = "SmartDevice";
})(DataSourceType || (DataSourceType = {}));
export class DataSource extends ConfigurationEntity {
}
