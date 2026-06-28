"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetDigitalSwitchConfig = exports.WidgetDigitalSwitchConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetDigitalSwitchConfigVersion = '2';
class WidgetDigitalSwitchConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetDigitalSwitchConfigVersion;
        this.type = null;
        this.caption = null;
        this.lockingValue = null;
        this.customLockingValue = null;
        this.lockingState = null;
        this.displayStatus = false;
        this.manageConditions = false;
        this.includeSignalHist = false;
    }
}
exports.WidgetDigitalSwitchConfig = WidgetDigitalSwitchConfig;
