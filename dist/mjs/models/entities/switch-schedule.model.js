import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export class SwitchSchedule extends ConfigurationEntity {
    constructor() {
        super();
        this.Rules = new Field([]);
    }
}
export class SwitchRule {
}
export class SwitchOperation extends ConfigurationEntity {
    constructor() {
        super();
        this.RuleId = new Field();
        this.SwitchScheduleId = new Field();
        this.Enabled = new Field();
        this.StartValue = new Field();
        this.EndValue = new Field();
    }
}
export var SwitchType;
(function (SwitchType) {
    SwitchType["On"] = "On";
    SwitchType["Off"] = "Off";
})(SwitchType || (SwitchType = {}));
