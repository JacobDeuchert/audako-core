import { BaseWidgetConfig, ObservationPeriodUnits } from './shared.js';
export declare const WidgetStartStopBatchConfigVersion = "1";
export declare class WidgetStartStopBatchConfig extends BaseWidgetConfig {
    batchDefId: string;
    showHistory: boolean;
    timePeriod: ObservationPeriodUnits;
    periodAmount: number;
    displayedMetadataFields: string[];
    orderSpecificMetadataFields: string[];
    constructor(config?: Omit<Partial<WidgetStartStopBatchConfig>, 'version'>);
}
