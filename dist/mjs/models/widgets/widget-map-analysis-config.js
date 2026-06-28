import { BaseWidgetConfig } from './shared.js';
export const MapAnalysesConfigVersion = '3';
export var MapAnalysisValueDisplayType;
(function (MapAnalysisValueDisplayType) {
    MapAnalysisValueDisplayType["LastValue"] = "LastValue";
    MapAnalysisValueDisplayType["Difference"] = "Difference";
    MapAnalysisValueDisplayType["Average"] = "Average";
})(MapAnalysisValueDisplayType || (MapAnalysisValueDisplayType = {}));
export const DEFAULT_MAP_ANALYSIS_DISPLAY_OPTIONS = {
    showTimestamp: true,
    showLatLng: true,
    showDuration: true,
};
export class WidgetMapAnalysesConfig extends BaseWidgetConfig {
    constructor(config = {}) {
        super();
        Object.assign(this, config);
        this.version = MapAnalysesConfigVersion;
    }
}
