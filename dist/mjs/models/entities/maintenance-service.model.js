import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class MaintenanceService extends ConfigurationEntity {
    constructor() {
        super();
        this.Category = new Field();
        this.Enabled = new Field();
        this.Trigger = new Field();
        this.MaintenanceTasks = new Field();
    }
}
