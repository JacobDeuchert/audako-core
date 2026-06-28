"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetBatchArchiveConfig = exports.WidgetBatchArchiveConfigVersion = void 0;
exports.WidgetBatchArchiveConfigVersion = '1';
class WidgetBatchArchiveConfig {
    constructor(config) {
        this.version = exports.WidgetBatchArchiveConfigVersion;
        if (config) {
            Object.assign(this, config);
        }
    }
}
exports.WidgetBatchArchiveConfig = WidgetBatchArchiveConfig;
