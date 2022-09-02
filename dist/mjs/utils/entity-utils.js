import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';
export class EntityUtils {
    static getEntityPropertiesByType(type) {
        const typeClass = EntityTypeClassMapping[type];
        if (!typeClass) {
            throw new Error(`Entity type ${type} is not supported`);
        }
        return Object.keys(new typeClass());
    }
}
