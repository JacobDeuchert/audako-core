import { BaseWidgetConfig, ObservationPeriodUnits } from './shared.js';
export const WidgetStartStopBatchConfigVersion = '1';
export class WidgetStartStopBatchConfig extends BaseWidgetConfig {
    constructor(config) {
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
