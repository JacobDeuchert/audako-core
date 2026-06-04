"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionParameter = exports.EventDefinition = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class EventDefinition extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new configuration_entity_model_js_1.Field(true);
        this.EventCategoryId = new configuration_entity_model_js_1.Field();
        this.ExpressionParameters = [];
        this.EventExpression = new configuration_entity_model_js_1.Field();
    }
}
exports.EventDefinition = EventDefinition;
class ExpressionParameter {
    constructor() {
        this.Type = new configuration_entity_model_js_1.Field();
        this.ParameterId = new configuration_entity_model_js_1.Field();
        this.ConditionId = new configuration_entity_model_js_1.Field();
    }
}
exports.ExpressionParameter = ExpressionParameter;
