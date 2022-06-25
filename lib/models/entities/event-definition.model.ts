import { ConfigurationEntity, Field } from './configuration-entity.model';

export class EventDefinition extends ConfigurationEntity {
  Enabled: Field<boolean>;
}
