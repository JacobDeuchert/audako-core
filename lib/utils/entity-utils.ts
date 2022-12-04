import { ConfigurationEntity, EntityType, Field } from '../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';

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

  public static setPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string, value: U) {
    this._setObjectProperty(entity, propertyPath.split('.'), value);
  }

  public static getPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string): U {

    const propertyPathParts = propertyPath.split('.');

    let propertyValue: any = entity;

    for (const propertyPathPart of propertyPathParts) {
      if (!propertyValue) {
        return null;
      }

      propertyValue = propertyValue[propertyPathPart]; 
    }

    if (Field.isField(propertyValue)) {
      return propertyValue.Value as U;
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

  private static _setObjectProperty<T>(object: object, propertyPath: string[], value: T): void {

    const objectKeys = Object.keys(object);

    const currentKey = propertyPath.shift();

    if (propertyPath.length === 0) {

      if (Field.isField(object[currentKey])) {
        object[currentKey] = new Field(value);
      } else {
        object[currentKey] = value;
      }
      return;
    } else if (objectKeys.includes(currentKey) && typeof object[currentKey] === 'object') {
      const nextObject = object[currentKey];
      this._setObjectProperty(nextObject, propertyPath, value);
    } 
  }
}