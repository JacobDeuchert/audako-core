import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum EventCategoryClass {
  CriticalAlarm = 'CriticalAlarm',
  MajorAlarm = 'MajorAlarm',
  MinorAlarm = 'MinorAlarm',
  WarningAlarm = 'WarningAlarm',
  InformationalAlarm = 'InformationalAlarm',
  IndeterminateAlarm = 'IndeterminateAlarm',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
}

export enum AlarmTrigger {
  OnRaised = 1,
  OnDropped = 2,
}

export class EventCategory extends ConfigurationEntity {
  public Class: Field<EventCategoryClass>;
  public RequiresAcknowledgment: Field<boolean>;
  /**
   * v5 only (>= 5.0, feature `acknowledgmentField`), and **not** the v4 `Acknowledgment` field:
   * up to 4.22 that wire key was the old name of {@link RequiresAcknowledgment} (renamed in 4.23,
   * without a server migrator), while v5 re-added `Acknowledgment` next to it with a different
   * meaning. Undefined on v4, where the v4 adapter strips it from writes.
   */
  public Acknowledgment?: Field<boolean>;
  public NoRepeatUntilAcknowledged: Field<boolean>;
  public AlarmOn: Field<AlarmTrigger>;
  /** Icon name, at most 64 characters. */
  public Icon: Field<string>;
  /** `#RRGGBB` or `#RRGGBBAA`. */
  public Color: Field<string>;

  constructor() {
    super();
    this.Class = new Field<EventCategoryClass>(EventCategoryClass.Info);
    this.RequiresAcknowledgment = new Field<boolean>(true);
    this.NoRepeatUntilAcknowledged = new Field<boolean>(false);
    this.AlarmOn = new Field<AlarmTrigger>(AlarmTrigger.OnRaised);
    this.Icon = new Field<string>();
    this.Color = new Field<string>();
  }
}
