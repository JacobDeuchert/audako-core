import { EntityType, Field } from '../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';
import { ObjectUtils } from './object-utils.js';
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
    static setPropertyValue(entity, propertyPath, value, isField, setOnlyExistingFields) {
        this._setObjectProperty(entity, propertyPath.split('.'), value, null, isField, setOnlyExistingFields);
    }
    static getPropertyValue(entity, propertyPath, isField) {
        var _a;
        const propertyPathParts = propertyPath.split('.');
        let propertyValue = entity;
        let previousPropertyPathPart = '';
        for (const propertyPathPart of propertyPathParts) {
            if (!propertyValue) {
                return null;
            }
            if (previousPropertyPathPart === 'AdditionalFields') {
                console.log(propertyValue, propertyPathPart);
                if ((_a = propertyValue[propertyPathPart]) === null || _a === void 0 ? void 0 : _a.Value) {
                    propertyValue = ObjectUtils.tryParseJson(propertyValue[propertyPathPart].Value);
                    console.log('AdditionalValue', propertyValue);
                }
            }
            else {
                propertyValue = propertyValue[propertyPathPart];
            }
            previousPropertyPathPart = propertyPathPart;
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
    static _setObjectProperty(object, propertyPath, value, previousKey, isField, setOnlyExistingFields) {
        const objectKeys = Object.keys(object);
        const currentKey = propertyPath.shift();
        if (previousKey === 'AdditionalFields') {
            this._setAdditionalField(object, propertyPath, value);
            return;
        }
        if (propertyPath.length === 0) {
            if ((setOnlyExistingFields && !objectKeys.includes(currentKey))) {
                return;
            }
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
            this._setObjectProperty(nextObject, propertyPath, value, currentKey, isField, setOnlyExistingFields);
        }
    }
    static _setAdditionalField(object, propertyPath, value) {
        if (propertyPath.length === 0) {
            return;
        }
        console.log('AdditionalField', object, propertyPath, value);
        const firstKey = propertyPath.shift();
        if (propertyPath.length === 0) {
            object[firstKey] = new Field(value === null || value === void 0 ? void 0 : value.toString());
            return;
        }
        else {
            let obj = object[firstKey] ? ObjectUtils.tryParseJson(object[firstKey].Value, {}) : {};
            for (const key of propertyPath) {
                const isLastKey = propertyPath.indexOf(key) === propertyPath.length - 1;
                if (isLastKey) {
                    obj[key] = value;
                }
                else {
                    obj[key] = obj[key] || {};
                    obj = obj[key];
                }
            }
            object[firstKey] = new Field(JSON.stringify(obj));
        }
    }
}
