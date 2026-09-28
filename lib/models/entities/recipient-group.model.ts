import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class RecipientGroup extends ConfigurationEntity {
  public Enabled: Field<boolean>;
  public Loops: Field<number>;
  public Members: RecipientGroupMember[];
  /** `#RRGGBB` or `#RRGGBBAA` */
  public Color: Field<string>;

  constructor() {
    super();
    this.Enabled = new Field<boolean>(true);
    this.Loops = new Field<number>(3);
    this.Members = [];
    this.Color = new Field<string>();
  }
}

export class RecipientGroupMember {
  public RecipientId: Field<string>;
  public Contact: Field<string>;
  public DeadTime: Field<number>;
}
