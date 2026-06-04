import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class RecipientGroup extends ConfigurationEntity {
    constructor() {
        super();
        this.Enabled = new Field(true);
        this.Loops = new Field(3);
        this.Members = [];
    }
}
export class RecipientGroupMember {
}
