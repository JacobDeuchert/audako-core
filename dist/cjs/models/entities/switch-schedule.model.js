"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchType = exports.SwitchOperation = exports.SwitchRule = exports.SwitchSchedule = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class SwitchSchedule extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Rules = new configuration_entity_model_js_1.Field([]);
    }
}
exports.SwitchSchedule = SwitchSchedule;
class SwitchRule {
}
exports.SwitchRule = SwitchRule;
class SwitchOperation extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.RuleId = new configuration_entity_model_js_1.Field();
        this.SwitchScheduleId = new configuration_entity_model_js_1.Field();
        this.Enabled = new configuration_entity_model_js_1.Field();
        this.StartValue = new configuration_entity_model_js_1.Field();
        this.EndValue = new configuration_entity_model_js_1.Field();
    }
}
exports.SwitchOperation = SwitchOperation;
var SwitchType;
(function (SwitchType) {
    SwitchType["On"] = "On";
    SwitchType["Off"] = "Off";
})(SwitchType || (exports.SwitchType = SwitchType = {}));
