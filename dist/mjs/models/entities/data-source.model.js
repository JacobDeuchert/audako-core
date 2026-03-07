import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var DataSourceType;
(function (DataSourceType) {
    DataSourceType["EdgeGateway"] = "EdgeGateway";
    DataSourceType["DataAdapter"] = "DataAdapter";
    DataSourceType["SmartDevice"] = "SmartDevice";
})(DataSourceType || (DataSourceType = {}));
export class DataSource extends ConfigurationEntity {
    constructor() {
        super();
        this.Address = new Field(null);
        this.Password = new Field(null);
        this.Type = new Field(DataSourceType.EdgeGateway);
        this.PermaLiveModeSettings = new PermaLiveModeSettings();
    }
}
export class PermaLiveModeSettings {
    constructor() {
        this.Enabled = new Field(false);
        this.BlockingTime = new Field(10);
    }
}
