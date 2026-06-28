import { BaseWidgetConfig, ObservationPeriodUnits } from './shared.js';

export const WidgetStartStopBatchConfigVersion = '1';

export class WidgetStartStopBatchConfig extends BaseWidgetConfig {
  batchDefId: string;
  showHistory: boolean;
  timePeriod: ObservationPeriodUnits;
  periodAmount: number;
  displayedMetadataFields: string[];
  orderSpecificMetadataFields: string[];

  constructor(config?: Omit<Partial<WidgetStartStopBatchConfig>, 'version'>) {
    super();
    this.version = WidgetStartStopBatchConfigVersion;
    this.displayedMetadataFields = [];
    this.orderSpecificMetadataFields = [];
    this.showHistory = true;
    this.timePeriod = ObservationPeriodUnits.Day;
    this.periodAmount = 1;

    if (config) {
      Object.assign(this, config);
    }
  }
}
