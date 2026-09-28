import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class Dashboard extends ConfigurationEntity {
  /** At most 64 characters. */
  public Icon: Field<string>;
  public Order: Field<number | null>;
  public StartTabId: Field<string>;

  constructor() {
    super();
    this.Icon = new Field<string>();
    this.Order = new Field<number | null>();
    this.StartTabId = new Field<string>();
  }
}
