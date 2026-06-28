import { BaseWidgetConfig } from './shared.js';
export var SetPointStatus;
(function (SetPointStatus) {
    SetPointStatus["Enabled"] = "Enabled";
    SetPointStatus["Disabled"] = "Disabled";
    SetPointStatus["Locked"] = "Locked";
})(SetPointStatus || (SetPointStatus = {}));
export const WidgetSetpointTableConfigVersion = '0';
export class WidgetSetpointTableConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.dataGroups = [];
        this.version = WidgetSetpointTableConfigVersion;
    }
}
