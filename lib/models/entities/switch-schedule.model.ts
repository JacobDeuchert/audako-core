import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class SwitchSchedule extends ConfigurationEntity {
  public Rules: Field<SwitchRule[]>;

  constructor() {
    super();
    this.Rules = new Field<SwitchRule[]>([]);
  }
}

export class SwitchRule {
  public Id: string;
  public Name: string;
  public SignalId: string;

  public DefaultStartValue: number;
  public MinStartValue: number;
  public MaxStartValue: number;

  public DefaultEndValue: number;
  public MinEndValue: number;
  public MaxEndValue: number;
}

export class SwitchOperation extends ConfigurationEntity {
  public AccessId: string;
  public RuleId: Field<string>;
  public SignalId: Field<string>;
  public SwitchScheduleId: Field<string>;
  public Enabled: Field<boolean>;
  public StartValue: Field<number>;
  public EndValue: Field<number>;

  constructor() {
    super();
    this.RuleId = new Field<string>();
    this.SwitchScheduleId = new Field<string>();
    this.Enabled = new Field<boolean>();
    this.StartValue = new Field<number>();
    this.EndValue = new Field<number>();
  }
}

export enum SwitchType {
  On = 'On',
  Off = 'Off',
}
