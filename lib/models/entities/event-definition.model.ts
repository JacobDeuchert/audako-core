import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class EventDefinition extends ConfigurationEntity {
  Enabled: Field<boolean>;
}
