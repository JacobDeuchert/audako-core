import { BaseWidgetConfig } from './shared.js';
export const WidgetClockConfigVersion = '1';
export class WidgetClockConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.clockType = ClockType.Analog;
        this.version = WidgetClockConfigVersion;
        this.seconds = false;
        this.date = false;
        this.timezone = 0;
    }
}
export var ClockType;
(function (ClockType) {
    ClockType["Digital"] = "Digital";
    ClockType["Analog"] = "Analog";
})(ClockType || (ClockType = {}));
