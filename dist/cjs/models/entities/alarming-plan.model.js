"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmingPlan = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class AlarmingPlan extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new configuration_entity_model_js_1.Field();
        this.Offset = new configuration_entity_model_js_1.Field();
        this.EventCategoryIds = new configuration_entity_model_js_1.Field();
        this.GlobalRecipient = new configuration_entity_model_js_1.Field();
        this.DefaultRecipient = new configuration_entity_model_js_1.Field();
    }
}
exports.AlarmingPlan = AlarmingPlan;
