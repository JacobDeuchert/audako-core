import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class EventDefinition extends ConfigurationEntity {
  public Enabled: Field<boolean>;
  public EventCategoryId: Field<string>;
  public ExpressionParameters: ExpressionParameter[];
  public EventExpression: Field<string>;

  constructor() {
    super();
    this.Enabled = new Field<boolean>(true);
    this.EventCategoryId = new Field<string>();
    this.ExpressionParameters = [];
    this.EventExpression = new Field<string>();
  }
}

export class ExpressionParameter {
  public Type: Field<string>;
  public ParameterId: Field<string>;
  public ConditionId: Field<string>;

  constructor() {
    this.Type = new Field<string>();
    this.ParameterId = new Field<string>();
    this.ConditionId = new Field<string>();
  }
}
