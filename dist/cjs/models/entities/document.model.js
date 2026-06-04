"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
class Document extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.DocumentFile = new configuration_entity_model_js_1.Field();
    }
}
exports.Document = Document;
