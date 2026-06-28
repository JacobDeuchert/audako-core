"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetNotesConfig = exports.WidgetNotesConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetNotesConfigVersion = '1';
class WidgetNotesConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetNotesConfigVersion;
    }
}
exports.WidgetNotesConfig = WidgetNotesConfig;
