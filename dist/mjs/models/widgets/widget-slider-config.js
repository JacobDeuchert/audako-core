import { BaseWidgetConfig } from './shared.js';
export const WidgetSliderConfigVersion = '0';
export class SliderEntry {
    constructor(options) {
        Object.assign(this, options);
    }
}
export class WidgetSliderConfig extends BaseWidgetConfig {
    constructor() {
        super();
        this.version = WidgetSliderConfigVersion;
        this.sliderGroups = null;
    }
}
