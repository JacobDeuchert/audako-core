"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepDefinition = exports.TaskDefinition = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class TaskDefinition extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this._t = this.constructor.name;
        this.DefaultAssignees = new configuration_entity_model_js_1.Field([]);
        this.AgendaDefinition = new configuration_entity_model_js_1.Field([]);
    }
}
exports.TaskDefinition = TaskDefinition;
class StepDefinition {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.Description = new configuration_entity_model_js_1.TranslatableField();
    }
}
exports.StepDefinition = StepDefinition;
