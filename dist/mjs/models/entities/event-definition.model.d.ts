import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare class EventDefinition extends ConfigurationEntity {
    Enabled: Field<boolean>;
    EventCategoryId: Field<string>;
    ExpressionParameters: ExpressionParameter[];
    EventExpression: Field<string>;
    constructor();
}
export declare class ExpressionParameter {
    Type: Field<string>;
    ParameterId: Field<string>;
    ConditionId: Field<string>;
    constructor();
}
