"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class MaintenanceService extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Category = new configuration_entity_model_js_1.Field();
        this.Enabled = new configuration_entity_model_js_1.Field();
        this.Trigger = new configuration_entity_model_js_1.Field();
        this.MaintenanceTasks = new configuration_entity_model_js_1.Field();
    }
}
exports.MaintenanceService = MaintenanceService;
