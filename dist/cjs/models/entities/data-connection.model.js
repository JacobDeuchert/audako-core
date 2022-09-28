"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataConnectionSettings = exports.DataConnection = exports.DataSourceType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var DataSourceType;
(function (DataSourceType) {
    DataSourceType["S7"] = "S7";
    DataSourceType["ModBus"] = "ModBus";
})(DataSourceType = exports.DataSourceType || (exports.DataSourceType = {}));
class DataConnection extends configuration_entity_model_js_1.ConfigurationEntity {
}
exports.DataConnection = DataConnection;
class DataConnectionSettings {
}
exports.DataConnectionSettings = DataConnectionSettings;
