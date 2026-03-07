"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermaLiveModeSettings = exports.DataSource = exports.DataSourceType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var DataSourceType;
(function (DataSourceType) {
    DataSourceType["EdgeGateway"] = "EdgeGateway";
    DataSourceType["DataAdapter"] = "DataAdapter";
    DataSourceType["SmartDevice"] = "SmartDevice";
})(DataSourceType || (exports.DataSourceType = DataSourceType = {}));
class DataSource extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Address = new configuration_entity_model_js_1.Field(null);
        this.Password = new configuration_entity_model_js_1.Field(null);
        this.Type = new configuration_entity_model_js_1.Field(DataSourceType.EdgeGateway);
        this.PermaLiveModeSettings = new PermaLiveModeSettings();
    }
}
exports.DataSource = DataSource;
class PermaLiveModeSettings {
    constructor() {
        this.Enabled = new configuration_entity_model_js_1.Field(false);
        this.BlockingTime = new configuration_entity_model_js_1.Field(10);
    }
}
exports.PermaLiveModeSettings = PermaLiveModeSettings;
