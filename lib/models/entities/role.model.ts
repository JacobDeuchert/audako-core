import { ConfigurationEntity } from './configuration-entity.model.js';

export class Role extends ConfigurationEntity {
  public RoleMember: string[];

  constructor() {
    super();
    this.RoleMember = [];
  }
}
