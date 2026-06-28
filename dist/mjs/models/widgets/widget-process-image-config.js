import { BaseWidgetConfig } from './shared.js';
export const WidgetProcessImageConfigVersion = '3';
export class WidgetProcessImageConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.backgroundColor = null;
        this.version = WidgetProcessImageConfigVersion;
        this.mode = CrossTabMode.Receive;
        this.backgroundColor = '#ffffff';
        this.transferToken = null;
        this.crossTabs = false;
    }
}
export var CrossTabMode;
(function (CrossTabMode) {
    CrossTabMode["Send"] = "Send";
    CrossTabMode["Receive"] = "Receive";
})(CrossTabMode || (CrossTabMode = {}));
