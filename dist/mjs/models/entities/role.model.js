import { ConfigurationEntity } from './configuration-entity.model.js';
export class Role extends ConfigurationEntity {
    constructor() {
        super();
        this.RoleMember = [];
    }
}
