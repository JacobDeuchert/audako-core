"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientGroupMember = exports.RecipientGroup = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class RecipientGroup extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new configuration_entity_model_js_1.Field(true);
        this.Loops = new configuration_entity_model_js_1.Field(3);
        this.Members = [];
    }
}
exports.RecipientGroup = RecipientGroup;
class RecipientGroupMember {
}
exports.RecipientGroupMember = RecipientGroupMember;
