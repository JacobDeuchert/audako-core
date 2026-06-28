"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetDocumentsArchiveConfig = exports.WidgetDocumentsArchiveConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetDocumentsArchiveConfigVersion = '1';
class WidgetDocumentsArchiveConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.version = exports.WidgetDocumentsArchiveConfigVersion;
    }
}
exports.WidgetDocumentsArchiveConfig = WidgetDocumentsArchiveConfig;
