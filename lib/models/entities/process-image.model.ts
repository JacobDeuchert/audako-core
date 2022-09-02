import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class ProcessImage extends ConfigurationEntity {

  public ImageFile: Field<string>;
  public RenderedFile: Field<string>;
}
