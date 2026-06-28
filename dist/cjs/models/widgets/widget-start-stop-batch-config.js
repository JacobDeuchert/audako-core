"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetStartStopBatchConfig = exports.WidgetStartStopBatchConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetStartStopBatchConfigVersion = '1';
class WidgetStartStopBatchConfig extends shared_js_1.BaseWidgetConfig {
    constructor(config) {
        super();
        this.version = exports.WidgetStartStopBatchConfigVersion;
        this.displayedMetadataFields = [];
        this.orderSpecificMetadataFields = [];
        this.showHistory = true;
        this.timePeriod = shared_js_1.ObservationPeriodUnits.Day;
        this.periodAmount = 1;
        if (config) {
            Object.assign(this, config);
        }
    }
}
exports.WidgetStartStopBatchConfig = WidgetStartStopBatchConfig;
