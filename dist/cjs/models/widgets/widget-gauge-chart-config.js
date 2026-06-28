"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGaugeInvertByKey = exports.GetGaugeRotationByKey = exports.GetRangeKey = exports.GaugeRange = exports.WidgetGaugeChartConfig = exports.GaugeValueObjectType = exports.WidgetGaugeChartConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetGaugeChartConfigVersion = '2';
var GaugeValueObjectType;
(function (GaugeValueObjectType) {
    GaugeValueObjectType["Signal"] = "Signal";
    GaugeValueObjectType["Formula"] = "Formula";
})(GaugeValueObjectType || (exports.GaugeValueObjectType = GaugeValueObjectType = {}));
class WidgetGaugeChartConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.DataType = GaugeValueObjectType.Signal;
        this.version = exports.WidgetGaugeChartConfigVersion;
    }
}
exports.WidgetGaugeChartConfig = WidgetGaugeChartConfig;
exports.GaugeRange = {
    q1: { start: -90, end: 0, rotation: 90, icon: 'qIcon', inverted: true },
    q2: { start: 0, end: 90, rotation: 340, icon: 'qIcon' },
    q3: { start: 90, end: 180, rotation: 95, icon: 'qIcon' },
    q4: { start: 180, end: 270, rotation: 90, icon: 'qIcon' },
    v1: { start: 225, end: 315, rotation: 0, icon: 'vIcon', inverted: true },
    v2: { start: -45, end: 45, rotation: 90, icon: 'vIcon', inverted: true },
    v3: { start: 45, end: 135, rotation: 0, icon: 'vIcon' },
    v4: { start: 135, end: 225, rotation: 90, icon: 'vIcon' },
    h1: { start: -180, end: 0, rotation: 0, icon: 'hIcon', inverted: true },
    h2: { start: -90, end: 90, rotation: 90, icon: 'hIcon', inverted: true },
    h3: { start: 0, end: 180, rotation: 0, icon: 'hIcon' },
    h4: { start: 90, end: 270, rotation: 90, icon: 'hIcon' },
    f1: { start: -225, end: 45, rotation: 0, icon: 'fIcon', inverted: true },
    f2: { start: -135, end: 135, rotation: 90, icon: 'fIcon', inverted: true },
    f3: { start: -45, end: 225, rotation: 0, icon: 'fIcon' },
    f4: { start: 45, end: 315, rotation: 90, icon: 'fIcon' },
};
function GetRangeKey(start, end) {
    for (const key in exports.GaugeRange)
        if (exports.GaugeRange[key].start === start && exports.GaugeRange[key].end === end)
            return key;
    return null;
}
exports.GetRangeKey = GetRangeKey;
function GetGaugeRotationByKey(key) {
    var _a;
    return (_a = exports.GaugeRange[key]) === null || _a === void 0 ? void 0 : _a.rotation;
}
exports.GetGaugeRotationByKey = GetGaugeRotationByKey;
function GetGaugeInvertByKey(key) {
    var _a;
    return !!((_a = exports.GaugeRange[key]) === null || _a === void 0 ? void 0 : _a.inverted);
}
exports.GetGaugeInvertByKey = GetGaugeInvertByKey;
