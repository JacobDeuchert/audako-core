"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMyTasksConfig = void 0;
const shared_js_1 = require("./shared.js");
class WidgetMyTasksConfig extends shared_js_1.BaseWidgetConfig {
    constructor(title = '', headerExpanded = false) {
        super();
        this.title = title;
        this.headerExpanded = headerExpanded;
    }
}
exports.WidgetMyTasksConfig = WidgetMyTasksConfig;
