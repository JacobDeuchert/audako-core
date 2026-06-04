"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTemplate = exports.ReportTimeStepSize = exports.ReportEngineType = void 0;
const configuration_entity_model_js_1 = require("./configuration-entity.model.js");
var ReportEngineType;
(function (ReportEngineType) {
    ReportEngineType["WYSIWYG"] = "WYSIWYG";
    ReportEngineType["JsTemplate"] = "JsTemplate";
})(ReportEngineType || (exports.ReportEngineType = ReportEngineType = {}));
var ReportTimeStepSize;
(function (ReportTimeStepSize) {
    ReportTimeStepSize["Day"] = "Day";
    ReportTimeStepSize["Week"] = "Week";
    ReportTimeStepSize["Month"] = "Month";
    ReportTimeStepSize["Year"] = "Year";
})(ReportTimeStepSize || (exports.ReportTimeStepSize = ReportTimeStepSize = {}));
class ReportTemplate extends configuration_entity_model_js_1.ConfigurationEntity {
    constructor() {
        super();
        this.ScriptFile = new configuration_entity_model_js_1.Field();
        this.TemplateFile = new configuration_entity_model_js_1.Field();
        this.EngineType = new configuration_entity_model_js_1.Field(ReportEngineType.JsTemplate);
        this.DefaultStepSize = new configuration_entity_model_js_1.Field(ReportTimeStepSize.Day);
    }
}
exports.ReportTemplate = ReportTemplate;
