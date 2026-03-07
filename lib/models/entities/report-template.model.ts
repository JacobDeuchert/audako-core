import { ConfigurationEntity, Field } from './configuration-entity.model.js';

export enum ReportEngineType {
  WYSIWYG = 'WYSIWYG',
  JsTemplate = 'JsTemplate',
}

export enum ReportTimeStepSize {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export class ReportTemplate extends ConfigurationEntity {
  public ScriptFile: Field<string>;
  public TemplateFile: Field<string>;
  public EngineType: Field<ReportEngineType>;
  public DefaultStepSize: Field<ReportTimeStepSize>;
}
