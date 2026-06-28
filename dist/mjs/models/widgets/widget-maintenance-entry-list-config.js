import { BaseWidgetConfig } from './shared.js';
export var MaintEntryState;
(function (MaintEntryState) {
    MaintEntryState["Ongoing"] = "Ongoing";
    MaintEntryState["Canceled"] = "Canceled";
    MaintEntryState["Completed"] = "Completed";
})(MaintEntryState || (MaintEntryState = {}));
export const WidgetMaintenanceEntryListConfigVersion = '2';
export class WidgetMaintenanceEntryListConfig extends BaseWidgetConfig {
    constructor(options) {
        super();
        this.version = WidgetMaintenanceEntryListConfigVersion;
        if (options) {
            Object.assign(this, options);
        }
    }
}
export var EntryListViewType;
(function (EntryListViewType) {
    EntryListViewType["Open"] = "Open";
    EntryListViewType["History"] = "History";
    EntryListViewType["All"] = "All";
})(EntryListViewType || (EntryListViewType = {}));
export var ServiceFilterType;
(function (ServiceFilterType) {
    ServiceFilterType["Group"] = "Group";
    ServiceFilterType["Service"] = "Service";
})(ServiceFilterType || (ServiceFilterType = {}));
