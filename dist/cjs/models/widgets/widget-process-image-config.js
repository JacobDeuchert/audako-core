"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossTabMode = exports.WidgetProcessImageConfig = exports.WidgetProcessImageConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetProcessImageConfigVersion = '3';
class WidgetProcessImageConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.backgroundColor = null;
        this.version = exports.WidgetProcessImageConfigVersion;
        this.mode = CrossTabMode.Receive;
        this.backgroundColor = '#ffffff';
        this.transferToken = null;
        this.crossTabs = false;
    }
}
exports.WidgetProcessImageConfig = WidgetProcessImageConfig;
var CrossTabMode;
(function (CrossTabMode) {
    CrossTabMode["Send"] = "Send";
    CrossTabMode["Receive"] = "Receive";
})(CrossTabMode || (exports.CrossTabMode = CrossTabMode = {}));
