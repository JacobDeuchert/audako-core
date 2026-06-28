import { BaseWidgetConfig } from './shared.js';
export const WidgetCameraConfigVersion = '1';
export class WidgetCameraConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetCameraConfigVersion;
    }
}
