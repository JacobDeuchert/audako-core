export const WidgetBatchArchiveConfigVersion = '1';
export class WidgetBatchArchiveConfig {
    constructor(config) {
        this.version = WidgetBatchArchiveConfigVersion;
        if (config) {
            Object.assign(this, config);
        }
    }
}
