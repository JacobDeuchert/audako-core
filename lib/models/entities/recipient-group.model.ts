import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class RecipientGroup extends ConfigurationEntity {
  public Enabled: Field<boolean>;
  public Loops: Field<number>;
  public Members: RecipientGroupMember[];

  constructor() {
    super();
    this.Enabled = new Field<boolean>(true);
    this.Loops = new Field<number>(3);
    this.Members = [];
  }
}

export class RecipientGroupMember {
  public RecipientId: Field<string>;
  public Contact: Field<string>;
  public DeadTime: Field<number>;
}
