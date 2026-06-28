"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetPdfViewerConfig = exports.WidgetPdfViewerConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetPdfViewerConfigVersion = '1';
class WidgetPdfViewerConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetPdfViewerConfigVersion;
    }
}
exports.WidgetPdfViewerConfig = WidgetPdfViewerConfig;
