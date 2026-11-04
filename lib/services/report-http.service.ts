import { ApiContext } from '../api/api-context.js';
import { ReportSettings } from '../models/entities/report.model.js';

export class ReportHttpService {
  constructor(public readonly ctx: ApiContext) {}

  /**
   * The parameters and elements the template's script declares, read by running the script. A
   * report's settings are those of its `Templates`; the platform has no per-report or multi-template
   * variant.
   */
  public async getTemplateSettings(templateId: string): Promise<ReportSettings> {
    const response = await this.ctx.request<ReportSettings>({
      name: 'reportTemplateSettings',
      templateId: templateId,
    });
    return response.data;
  }
}
