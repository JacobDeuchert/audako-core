import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class AlarmingPlan extends ConfigurationEntity {
  public Enabled: Field<boolean>;
  public Offset: Field<string>;
  public EventCategoryIds: Field<string[]>;
  public GlobalRecipient: Field<string>;
  public DefaultRecipient: Field<string>;

  constructor() {
    super();
    this.Enabled = new Field<boolean>();
    this.Offset = new Field<string>();
    this.EventCategoryIds = new Field<string[]>();
    this.GlobalRecipient = new Field<string>();
    this.DefaultRecipient = new Field<string>();
  }
}
