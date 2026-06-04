"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardTabEntity = exports.DashboardTabPlaceholder = exports.DashboardTab = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class DashboardTab extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.DashboardId = new configuration_entity_model_js_1.Field();
        this.Content = new configuration_entity_model_js_1.Field();
        this.MasterTabId = new configuration_entity_model_js_1.Field();
        this.EntityMappings = new configuration_entity_model_js_1.Field();
        this.PlaceholderDefinition = new configuration_entity_model_js_1.Field();
        this.PlaceholderValues = new configuration_entity_model_js_1.Field();
    }
}
exports.DashboardTab = DashboardTab;
class DashboardTabPlaceholder {
}
exports.DashboardTabPlaceholder = DashboardTabPlaceholder;
class DashboardTabEntity {
}
exports.DashboardTabEntity = DashboardTabEntity;
