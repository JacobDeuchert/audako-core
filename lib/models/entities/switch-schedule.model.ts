import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export class SwitchSchedule extends ConfigurationEntity {
  public Rules: Field<SwitchRule[]>;
  /** Icon name, at most 64 characters. */
  public Icon: Field<string>;

  constructor() {
    super();
    this.Rules = new Field<SwitchRule[]>([]);
    this.Icon = new Field<string>();
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
  /** `#RRGGBB` or `#RRGGBBAA`. */
  public Color: Field<string>;

  constructor() {
    super();
    this.RuleId = new Field<string>();
    this.SwitchScheduleId = new Field<string>();
    this.Enabled = new Field<boolean>();
    this.StartValue = new Field<number>();
    this.EndValue = new Field<number>();
    this.Color = new Field<string>();
  }
}

export enum SwitchType {
  On = 'On',
  Off = 'Off',
}
