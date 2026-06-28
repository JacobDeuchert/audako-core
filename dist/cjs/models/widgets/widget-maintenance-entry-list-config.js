"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFilterType = exports.EntryListViewType = exports.WidgetMaintenanceEntryListConfig = exports.WidgetMaintenanceEntryListConfigVersion = exports.MaintEntryState = void 0;
const shared_js_1 = require("./shared.js");
var MaintEntryState;
(function (MaintEntryState) {
    MaintEntryState["Ongoing"] = "Ongoing";
    MaintEntryState["Canceled"] = "Canceled";
    MaintEntryState["Completed"] = "Completed";
})(MaintEntryState || (exports.MaintEntryState = MaintEntryState = {}));
exports.WidgetMaintenanceEntryListConfigVersion = '2';
class WidgetMaintenanceEntryListConfig extends shared_js_1.BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = exports.WidgetMaintenanceEntryListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
exports.WidgetMaintenanceEntryListConfig = WidgetMaintenanceEntryListConfig;
var EntryListViewType;
(function (EntryListViewType) {
    EntryListViewType["Open"] = "Open";
    EntryListViewType["History"] = "History";
    EntryListViewType["All"] = "All";
})(EntryListViewType || (exports.EntryListViewType = EntryListViewType = {}));
var ServiceFilterType;
(function (ServiceFilterType) {
    ServiceFilterType["Group"] = "Group";
    ServiceFilterType["Service"] = "Service";
})(ServiceFilterType || (exports.ServiceFilterType = ServiceFilterType = {}));
