"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSource = exports.DataSourceType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var DataSourceType;
(function (DataSourceType) {
    DataSourceType["EdgeGateway"] = "EdgeGateway";
    DataSourceType["DataAdapter"] = "DataAdapter";
})(DataSourceType || (exports.DataSourceType = DataSourceType = {}));
class DataSource extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.DataSource = DataSource;
