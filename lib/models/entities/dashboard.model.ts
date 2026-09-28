import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class Dashboard extends ConfigurationEntity {
  /** Icon name, at most 64 characters. */
  public Icon: Field<string>;
  /** Sort key, ascending; `null` sorts last (then by `Name`). */
  public Order: Field<number | null>;
  /** Id of one of the dashboard's own tabs. */
  public StartTabId: Field<string>;

  constructor() {
    super();
    this.Icon = new Field<string>();
    this.Order = new Field<number | null>();
    this.StartTabId = new Field<string>();
  }
}
