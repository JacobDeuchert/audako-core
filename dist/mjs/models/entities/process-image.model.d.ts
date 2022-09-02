import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class ProcessImage extends ConfigurationEntity {
    ImageFile: Field<string>;
    RenderedFile: Field<string>;
}
