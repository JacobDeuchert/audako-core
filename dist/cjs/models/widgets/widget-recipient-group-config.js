"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetRecipientGroupConfig = exports.WidgetRecipientGroupConfigVersion = void 0;
const shared_js_1 = require("./shared.js");
exports.WidgetRecipientGroupConfigVersion = '1';
class WidgetRecipientGroupConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.title = 'Widget';
        this.version = exports.WidgetRecipientGroupConfigVersion;
        this.recipientGroupId = '';
    }
}
exports.WidgetRecipientGroupConfig = WidgetRecipientGroupConfig;
