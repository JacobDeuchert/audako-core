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
  public NoRepeatUntilAcknowledged: Field<boolean>;
  public AlarmOn: Field<AlarmTrigger>;

  constructor() {
    super();
    this.Class = new Field<EventCategoryClass>(EventCategoryClass.Info);
    this.RequiresAcknowledgment = new Field<boolean>(true);
    this.NoRepeatUntilAcknowledged = new Field<boolean>(false);
    this.AlarmOn = new Field<AlarmTrigger>(AlarmTrigger.OnRaised);
  }
}
