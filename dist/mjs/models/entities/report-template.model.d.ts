import { ConfigurationEntity, Field } from './configuration-entity.model.js';
export declare enum ReportEngineType {
    WYSIWYG = "WYSIWYG",
    JsTemplate = "JsTemplate"
}
export declare enum ReportTimeStepSize {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year"
}
export declare class ReportTemplate extends ConfigurationEntity {
    ScriptFile: Field<string>;
    TemplateFile: Field<string>;
    EngineType: Field<ReportEngineType>;
    DefaultStepSize: Field<ReportTimeStepSize>;
}
