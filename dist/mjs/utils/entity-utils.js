import { EntityType, Field } from '../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';
export class EntityUtils {
    static isEntityType(type) {
        return Object.keys(EntityType).includes(type);
    }
    static getEntityPropertiesByType(type, deep) {
        const typeClass = EntityTypeClassMapping[type];
        if (!typeClass) {
            throw new Error(`Entity type ${type} is not supported`);
        }
        const entity = new typeClass();
        return this._getObjectKeys(entity, deep);
    }
    static setPropertyValue(entity, propertyPath, value, isField) {
        this._setObjectProperty(entity, propertyPath.split('.'), value, isField);
    }
    static getPropertyValue(entity, propertyPath, isField) {
        const propertyPathParts = propertyPath.split('.');
        let propertyValue = entity;
        for (const propertyPathPart of propertyPathParts) {
            if (!propertyValue) {
                return null;
            }
            propertyValue = propertyValue[propertyPathPart];
        }
        if (isField || Field.isField(propertyValue)) {
            return propertyValue === null || propertyValue === void 0 ? void 0 : propertyValue.Value;
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
            if (Field.isField(value)) {
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
    static _setObjectProperty(object, propertyPath, value, isField) {
        const objectKeys = Object.keys(object);
        const currentKey = propertyPath.shift();
        if (propertyPath.length === 0) {
            if (isField || Field.isField(object[currentKey])) {
                object[currentKey] = new Field(value);
            }
            else {
                object[currentKey] = value;
            }
            return;
        }
        else if (objectKeys.includes(currentKey) && typeof object[currentKey] === 'object') {
            const nextObject = object[currentKey];
            this._setObjectProperty(nextObject, propertyPath, value);
        }
    }
}
