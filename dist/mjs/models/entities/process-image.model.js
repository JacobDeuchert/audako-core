import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class ProcessImage extends ConfigurationEntity {
    constructor() {
        super();
        this.ImageFile = new Field();
    }
}
