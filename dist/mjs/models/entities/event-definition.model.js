import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class EventDefinition extends ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new Field(true);
        this.EventCategoryId = new Field();
        this.ExpressionParameters = [];
        this.EventExpression = new Field();
    }
}
export class ExpressionParameter {
    constructor() {
        this.Type = new Field();
        this.ParameterId = new Field();
        this.ConditionId = new Field();
    }
}
