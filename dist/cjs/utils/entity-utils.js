"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityUtils = void 0;
const configuration_entity_model_js_1 = require("../models/entities/configuration-entity.model.js");
const entity_type_class_mapping_js_1 = require("../models/entity-type-class-mapping.js");
class EntityUtils {
    static getEntityPropertiesByType(type, deep) {
        const typeClass = entity_type_class_mapping_js_1.EntityTypeClassMapping[type];
        if (!typeClass) {
            throw new Error(`Entity type ${type} is not supported`);
        }
        const entity = new typeClass();
        return this._getObjectKeys(entity, deep);
    }
    static getPropertyValue(entity, propertyPath) {
        const propertyPathParts = propertyPath.split('.');
        let propertyValue = entity;
        for (const propertyPathPart of propertyPathParts) {
            if (!propertyValue) {
                return null;
            }
            propertyValue = propertyValue[propertyPathPart];
        }
        if (configuration_entity_model_js_1.Field.isField(propertyValue)) {
            return propertyValue.Value;
        }
        return propertyValue;
    }
    static _getObjectKeys(object, deep) {
        if (!object) {
            return [];
        }
        const keys = Object.keys(object);
        if (!deep) {
            return keys.map(key => {
                return {
                    keys: [],
                    name: key,
                    type: typeof object[key]
                };
            });
        }
        const deepKeys = [];
        for (const key of keys) {
            const value = object[key];
            if (configuration_entity_model_js_1.Field.isField(value)) {
                deepKeys.push({
                    keys: [],
                    name: key,
                    type: 'Field'
                });
            }
            else if (value == null) {
                deepKeys.push({
                    keys: [],
                    name: key,
                    type: 'null'
                });
            }
            else if (typeof value === 'object') {
                deepKeys.push({
                    keys: this._getObjectKeys(value, deep),
                    name: key,
                    type: typeof value
                });
            }
            else {
                deepKeys.push({
                    keys: [],
                    name: key,
                    type: typeof value
                });
            }
        }
        return deepKeys;
    }
}
exports.EntityUtils = EntityUtils;