import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class Document extends ConfigurationEntity {
    constructor() {
        super();
        this.DocumentFile = new Field();
    }
}
