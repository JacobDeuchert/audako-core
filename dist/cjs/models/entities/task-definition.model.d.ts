import { ConfigurationEntity, Field, TranslatableField } from './configuration-entity.model.js';
export declare class TaskDefinition extends ConfigurationEntity {
    _t: string;
    Revision: number;
    AgendaDefinition: Field<StepDefinition[]>;
    AssignedDocuments: Field<string[]>;
    DefaultAssignees: Field<string[]>;
    constructor();
}
export declare abstract class StepDefinition {
    _t: string;
    Description: TranslatableField<string>;
    constructor(typeName?: string);
}
