import { ConfigurationEntity, EntityType } from '../models/entities/configuration-entity.model.js';
export declare type ObjectKey = {
    keys: ObjectKey[];
    name: string;
    type: string;
};
export declare class EntityUtils {
    static getEntityPropertiesByType(type: EntityType, deep: boolean): ObjectKey[];
    static getPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string): U;
    private static _getObjectKeys;
}
