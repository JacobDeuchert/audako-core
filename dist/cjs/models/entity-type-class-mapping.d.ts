import { Type } from '../interfaces/type.js';
import { ConfigurationEntity, EntityType } from './entities/configuration-entity.model.js';
export declare const EntityTypeClassMapping: {
    [p in EntityType]: Type<ConfigurationEntity>;
};
