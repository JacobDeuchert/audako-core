import { ConfigurationEntity, EntityType, Field } from '../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';
import { ObjectUtils } from './object-utils.js';

export type ObjectKey = {
  keys: ObjectKey[];
  name: string;
  type: string;
}

export class EntityUtils {

  public static isEntityType(type: string): type is EntityType {
    return Object.keys(EntityType).includes(type);
  }

  public static getEntityPropertiesByType(type: EntityType, deep: boolean): ObjectKey[] {
    const typeClass = EntityTypeClassMapping[type];

    if (!typeClass) {
      throw new Error(`Entity type ${type} is not supported`);
    }

    const entity = new typeClass()
    return this._getObjectKeys(entity, deep);
  }

  public static setPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string, value: U, isField?: boolean, setOnlyExistingFields?: boolean) {
    this._setObjectProperty(entity, propertyPath.split('.'), value, null, isField, setOnlyExistingFields);
  }

  public static getPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string, isField?: boolean): U {

    const propertyPathParts = propertyPath.split('.');

    let propertyValue: any = entity;

    let previousPropertyPathPart = '';
    for (const propertyPathPart of propertyPathParts) {
      if (!propertyValue) {
        return null;
      }

      if (previousPropertyPathPart === 'AdditionalFields') {
        console.log(propertyValue, propertyPathPart);
        if (propertyValue[propertyPathPart]?.Value) {
          propertyValue = ObjectUtils.tryParseJson(propertyValue[propertyPathPart].Value);
          console.log('AdditionalValue', propertyValue);
        }
      } else {
        propertyValue = propertyValue[propertyPathPart]; 
      }

      previousPropertyPathPart = propertyPathPart;
    }

    if (isField || Field.isField(propertyValue)) {
      return propertyValue?.Value as U;
    } 
    return propertyValue as U;
  }

  private static _getObjectKeys(object: any, deep: boolean): ObjectKey[] {

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
        }
      });
    }

    const deepKeys: ObjectKey[] = [];

    for (const key of keys) {
      const value = object[key];

      if (Field.isField(value)) {
        deepKeys.push({
          keys: [],
          name: key,
          type: 'Field'
        });
      } else if (value == null) {
        deepKeys.push({
          keys: [],
          name: key,
          type: 'null'
        });
      } else if (typeof value === 'object') {
        deepKeys.push({
          keys: this._getObjectKeys(value, deep),
          name: key,
          type: typeof value
        });
      } else {
        deepKeys.push({
          keys: [],
          name: key,
          type: typeof value
        });
      }
    }

    return deepKeys;
  }

  private static _setObjectProperty<T>(object: object, propertyPath: string[], value: T, previousKey: string, isField?: boolean, setOnlyExistingFields?: boolean): void {

    if (!object || propertyPath.length === 0) {
      return;
    }

    const objectKeys = Object.keys(object);

    if (previousKey === 'AdditionalFields') {
      this._setAdditionalField(object, propertyPath, value);
      return;
    }

    const currentKey = propertyPath.shift();

    if (propertyPath.length === 0) {

      if ((setOnlyExistingFields && !objectKeys.includes(currentKey))) {
        return;
      }
      if (isField || Field.isField(object[currentKey])) {
        object[currentKey] = new Field(value);
      } else {
        object[currentKey] = value;
      }
      return;
    } else if (objectKeys.includes(currentKey) && typeof object[currentKey] === 'object') {
      const nextObject = object[currentKey];
      this._setObjectProperty(nextObject, propertyPath, value, currentKey, isField , setOnlyExistingFields);
    } 
  }

  private static _setAdditionalField<T>(object: object, propertyPath: string[], value: T): void {
    if (propertyPath.length === 0) {
      return;
    }

    console.log('AdditionalField', object, propertyPath, value);

    const firstKey = propertyPath.shift();

    if (propertyPath.length === 0) {
      object[firstKey] = new Field(value?.toString());
      return;
    } else {
      let obj = object[firstKey] ? ObjectUtils.tryParseJson(object[firstKey].Value, {}) : {};
      for (const key of propertyPath) {
        const isLastKey = propertyPath.indexOf(key) === propertyPath.length - 1;
        if (isLastKey) {
          obj[key] = value;
        } else {
          obj[key] = obj[key] || {};
          obj = obj[key];
        }
      }

      object[firstKey] = new Field(JSON.stringify(obj));
    }
  }
}