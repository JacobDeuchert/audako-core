import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class SwitchSchedule extends ConfigurationEntity {
    Rules: Field<SwitchRule[]>;
    constructor();
}
export declare class SwitchRule {
    Id: string;
    Name: string;
    SignalId: string;
    DefaultStartValue: number;
    MinStartValue: number;
    MaxStartValue: number;
    DefaultEndValue: number;
    MinEndValue: number;
    MaxEndValue: number;
}
export declare class SwitchOperation extends ConfigurationEntity {
    AccessId: string;
    RuleId: Field<string>;
    SignalId: Field<string>;
    SwitchScheduleId: Field<string>;
    Enabled: Field<boolean>;
    StartValue: Field<number>;
    EndValue: Field<number>;
    constructor();
}
export declare enum SwitchType {
    On = "On",
    Off = "Off"
}
