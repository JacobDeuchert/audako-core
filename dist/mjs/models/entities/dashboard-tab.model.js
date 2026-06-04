import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class DashboardTab extends ConfigurationEntity {
    constructor() {
        super();
        this.DashboardId = new Field();
        this.Content = new Field();
        this.MasterTabId = new Field();
        this.EntityMappings = new Field();
        this.PlaceholderDefinition = new Field();
        this.PlaceholderValues = new Field();
    }
}
export class DashboardTabPlaceholder {
}
export class DashboardTabEntity {
}
