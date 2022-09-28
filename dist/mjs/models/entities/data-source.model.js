import { ConfigurationEntity } from './configuration-entity.model.js';
export var DataSourceType;
(function (DataSourceType) {
    DataSourceType["EdgeGateway"] = "EdgeGateway";
    DataSourceType["DataAdapter"] = "DataAdapter";
})(DataSourceType || (DataSourceType = {}));
export class DataSource extends ConfigurationEntity {
}
