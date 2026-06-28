"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetLiquidFillGaugeConfig = exports.WidgetLiquidFillGaugeConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetLiquidFillGaugeConfigVersion = '1';
class WidgetLiquidFillGaugeConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetLiquidFillGaugeConfigVersion;
        this.minValue = 0;
        this.maxValue = 100;
        this.gaugeTitle = '';
        this.suffix = '';
        this.displaySuffix = true;
        this.waveCount = 2;
        this.circleThickness = 0.05;
        this.circleFillGap = 0.05;
        this.animateWave = true;
        this.waveColor = '#178BCA';
        this.circleColor = '#178BCA';
        this.textColor = '#045681';
        this.waveTextColor = '#A4DBf8';
        this.signalId = null;
        this.waveAnimateTime = 4000;
        this.waveHeight = 0.1;
        this.showMinMax = false;
        this.showNullLine = false;
        this.manageConditions = false;
        this.includeSignalHist = false;
    }
}
exports.WidgetLiquidFillGaugeConfig = WidgetLiquidFillGaugeConfig;
