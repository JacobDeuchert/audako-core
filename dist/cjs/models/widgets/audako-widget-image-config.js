"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudakoWidgetImageConfig = exports.AudakoWidgetImageConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.AudakoWidgetImageConfigVersion = '2';
class AudakoWidgetImageConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.AudakoWidgetImageConfigVersion;
    }
}
exports.AudakoWidgetImageConfig = AudakoWidgetImageConfig;
