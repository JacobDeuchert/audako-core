import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export var ReportEngineType;
(function (ReportEngineType) {
    ReportEngineType["WYSIWYG"] = "WYSIWYG";
    ReportEngineType["JsTemplate"] = "JsTemplate";
})(ReportEngineType || (ReportEngineType = {}));
export var ReportTimeStepSize;
(function (ReportTimeStepSize) {
    ReportTimeStepSize["Day"] = "Day";
    ReportTimeStepSize["Week"] = "Week";
    ReportTimeStepSize["Month"] = "Month";
    ReportTimeStepSize["Year"] = "Year";
})(ReportTimeStepSize || (ReportTimeStepSize = {}));
export class ReportTemplate extends ConfigurationEntity {
    constructor() {
        super();
        this.ScriptFile = new Field();
        this.TemplateFile = new Field();
        this.EngineType = new Field(ReportEngineType.JsTemplate);
        this.DefaultStepSize = new Field(ReportTimeStepSize.Day);
    }
}
