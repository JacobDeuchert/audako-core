import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class MaintenanceService extends ConfigurationEntity {
  public Category: Field<string>;
  public Enabled: Field<boolean>;
  public Trigger: Field<string[]>;
  public MaintenanceTasks: Field<string[]>;

  constructor() {
    super();
    this.Category = new Field<string>();
    this.Enabled = new Field<boolean>();
    this.Trigger = new Field<string[]>();
    this.MaintenanceTasks = new Field<string[]>();
  }
}
