"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetDataImportConfig = exports.WidgetDataImportConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetDataImportConfigVersion = '1';
class WidgetDataImportConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.title = 'WidgetDataImport';
        this.signals = [];
        this.version = exports.WidgetDataImportConfigVersion;
        this.signals = [];
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetDataImportConfig = WidgetDataImportConfig;
