"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMapAnalysesConfig = exports.DEFAULT_MAP_ANALYSIS_DISPLAY_OPTIONS = exports.MapAnalysisValueDisplayType = exports.MapAnalysesConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.MapAnalysesConfigVersion = '3';
var MapAnalysisValueDisplayType;
(function (MapAnalysisValueDisplayType) {
    MapAnalysisValueDisplayType["LastValue"] = "LastValue";
    MapAnalysisValueDisplayType["Difference"] = "Difference";
    MapAnalysisValueDisplayType["Average"] = "Average";
})(MapAnalysisValueDisplayType || (exports.MapAnalysisValueDisplayType = MapAnalysisValueDisplayType = {}));
exports.DEFAULT_MAP_ANALYSIS_DISPLAY_OPTIONS = {
    showTimestamp: true,
    showLatLng: true,
    showDuration: true,
};
class WidgetMapAnalysesConfig extends shared_js_1.BaseWidgetConfig {
    constructor(config = {}) {
        super();
        Object.assign(this, config);
        this.version = exports.MapAnalysesConfigVersion;
    }
}
exports.WidgetMapAnalysesConfig = WidgetMapAnalysesConfig;
