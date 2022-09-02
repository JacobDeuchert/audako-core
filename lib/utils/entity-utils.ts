import { EntityType } from '../models/entities/configuration-entity.model.js';
import { EntityTypeClassMapping } from '../models/entity-type-class-mapping.js';

export class EntityUtils {

  public static getEntityPropertiesByType(type: EntityType): string[] {
    const typeClass = EntityTypeClassMapping[type];

    if (!typeClass) {
      throw new Error(`Entity type ${type} is not supported`);
    }
    return Object.keys(new typeClass());
  }
}