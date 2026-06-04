import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class AlarmingPlan extends ConfigurationEntity {
    Enabled: Field<boolean>;
    Offset: Field<string>;
    EventCategoryIds: Field<string[]>;
    GlobalRecipient: Field<string>;
    DefaultRecipient: Field<string>;
    constructor();
}
