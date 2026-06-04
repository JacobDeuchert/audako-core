import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class RecipientGroup extends ConfigurationEntity {
    Enabled: Field<boolean>;
    Loops: Field<number>;
    Members: RecipientGroupMember[];
    constructor();
}
export declare class RecipientGroupMember {
    RecipientId: Field<string>;
    Contact: Field<string>;
    DeadTime: Field<number>;
}
