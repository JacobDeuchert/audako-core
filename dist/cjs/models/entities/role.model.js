"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Role extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.RoleMember = [];
    }
}
exports.Role = Role;
