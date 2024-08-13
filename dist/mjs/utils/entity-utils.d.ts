import { ConfigurationEntity, EntityType } from '../models/entities/configuration-entity.model.js';
export type ObjectKey = {
    keys: ObjectKey[];
    name: string;
    type: string;
};
export declare class EntityUtils {
    static isEntityType(type: string): type is EntityType;
    static getEntityPropertiesByType(type: EntityType, deep: boolean): ObjectKey[];
    static setPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string, value: U, isField?: boolean, setOnlyExistingFields?: boolean): void;
    static getPropertyValue<T extends ConfigurationEntity, U>(entity: T, propertyPath: string, isField?: boolean): U;
    private static _getObjectKeys;
    private static _setObjectProperty;
    private static _setAdditionalField;
}
