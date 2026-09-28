import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class Role extends ConfigurationEntity {
  public RoleMember: string[];
  /** Dashboard id. */
  public StartDashboardId: Field<string>;

  constructor() {
    super();
    this.RoleMember = [];
    this.StartDashboardId = new Field<string>();
  }
}
