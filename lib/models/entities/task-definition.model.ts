import { ConfigurationEntity, Field, TranslatableField } from './configuration-entity.model.js';

export class TaskDefinition extends ConfigurationEntity {
  public _t: string;
  public Revision: number;
  public AgendaDefinition: Field<StepDefinition[]>;
  public AssignedDocuments: Field<string[]>;
  public DefaultAssignees: Field<string[]>;

  constructor() {
    super();
    this._t = this.constructor.name;
    this.DefaultAssignees = new Field<string[]>([]);
    this.AgendaDefinition = new Field<StepDefinition[]>([]);
  }
}

export abstract class StepDefinition {
  public _t: string;
  public Description: TranslatableField<string>;

  constructor(typeName?: string) {
    this._t = typeName ?? this.constructor.name;
    this.Description = new TranslatableField<string>();
  }
}
