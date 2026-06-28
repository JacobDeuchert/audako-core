import { BaseWidgetConfig } from './shared.js';
export const WidgetGaugeChartConfigVersion = '2';
export var GaugeValueObjectType;
(function (GaugeValueObjectType) {
    GaugeValueObjectType["Signal"] = "Signal";
    GaugeValueObjectType["Formula"] = "Formula";
})(GaugeValueObjectType || (GaugeValueObjectType = {}));
export class WidgetGaugeChartConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.DataType = GaugeValueObjectType.Signal;
        this.version = WidgetGaugeChartConfigVersion;
    }
}
export const GaugeRange = {
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
export function GetRangeKey(start, end) {
    for (const key in GaugeRange)
        if (GaugeRange[key].start === start && GaugeRange[key].end === end)
            return key;
    return null;
}
export function GetGaugeRotationByKey(key) {
    var _a;
    return (_a = GaugeRange[key]) === null || _a === void 0 ? void 0 : _a.rotation;
}
export function GetGaugeInvertByKey(key) {
    var _a;
    return !!((_a = GaugeRange[key]) === null || _a === void 0 ? void 0 : _a.inverted);
}
