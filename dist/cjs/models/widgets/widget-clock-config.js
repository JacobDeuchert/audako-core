"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockType = exports.WidgetClockConfig = exports.WidgetClockConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetClockConfigVersion = '1';
class WidgetClockConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.clockType = ClockType.Analog;
        this.version = exports.WidgetClockConfigVersion;
        this.seconds = false;
        this.date = false;
        this.timezone = 0;
    }
}
exports.WidgetClockConfig = WidgetClockConfig;
var ClockType;
(function (ClockType) {
    ClockType["Digital"] = "Digital";
    ClockType["Analog"] = "Analog";
})(ClockType || (exports.ClockType = ClockType = {}));
