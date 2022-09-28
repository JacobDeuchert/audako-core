import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class EventCondition extends ConfigurationEntity {
    Settings: ConditionSettings;
}
export declare enum EventConditionSettingsType {
    SignalConditionSettings = "SignalConditionSettings",
    DataConnectionFailureConditionSettings = "DataConnectionFailureConditionSettings"
}
export declare class ConditionSettings {
    _t: EventConditionSettingsType;
}
export declare class SignalConditionSettings extends ConditionSettings {
    InConditionOperator: Field<string>;
    OutConditionOperator: Field<string>;
    InConditionValue: Field<string>;
    OutConditionValue: Field<string>;
    InDelay: Field<number>;
    OutDelay: Field<number>;
    SignalId: Field<string>;
}
export declare class DataConnectionFailureConditionSettings extends ConditionSettings {
    MaxOfflineTimeout: Field<number>;
    DataConnectionId: Field<string>;
}
