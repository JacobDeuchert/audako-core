"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityUtils = void 0;
const entity_type_class_mapping_js_1 = require("../models/entity-type-class-mapping.js");
class EntityUtils {
    static getEntityPropertiesByType(type) {
        const typeClass = entity_type_class_mapping_js_1.EntityTypeClassMapping[type];
        if (!typeClass) {
            throw new Error(`Entity type ${type} is not supported`);
        }
        return Object.keys(new typeClass());
    }
}
exports.EntityUtils = EntityUtils;
