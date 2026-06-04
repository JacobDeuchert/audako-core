import { ConfigurationEntity, Field, TranslatableField } from './configuration-entity.model.js';
export class TaskDefinition extends ConfigurationEntity {
    constructor() {
        super();
        this._t = this.constructor.name;
        this.DefaultAssignees = new Field([]);
        this.AgendaDefinition = new Field([]);
    }
}
export class StepDefinition {
    constructor(typeName) {
        this._t = typeName !== null && typeName !== void 0 ? typeName : this.constructor.name;
        this.Description = new TranslatableField();
    }
}
