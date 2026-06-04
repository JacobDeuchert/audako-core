import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class Document extends ConfigurationEntity {
  public DocumentFile: Field<string>;

  constructor() {
    super();
    this.DocumentFile = new Field<string>();
  }
}
