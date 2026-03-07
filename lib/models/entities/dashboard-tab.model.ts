import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class DashboardTab extends ConfigurationEntity {
  public DashboardId: Field<string>;
  public Content: Field<string>;
}
