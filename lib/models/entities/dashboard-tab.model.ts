import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class DashboardTab extends ConfigurationEntity {
  public Content: Field<string>;
}
