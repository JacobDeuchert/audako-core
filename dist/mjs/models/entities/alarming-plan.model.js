import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class AlarmingPlan extends ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new Field();
        this.Offset = new Field();
        this.EventCategoryIds = new Field();
        this.GlobalRecipient = new Field();
        this.DefaultRecipient = new Field();
    }
}
