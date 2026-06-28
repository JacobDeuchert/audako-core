import { BaseWidgetConfig } from './shared.js';

export const WidgetSliderConfigVersion = '0';

export interface SliderGroup {
  groupName: string;
  groupSliders: SliderEntry[];
  groupExpanded: boolean;
}

export class SliderEntry {
  sliderId: string;
  signalId: string;
  signalName: { name: string; useSignalName: boolean };
  minLabel: string;
  maxLabel: string;
  displayInfos: boolean;
  sliderDelay: number;
  isSliderDelay: boolean;
  handMin: number;
  handMax: number;
  stepSize: number;
  autoScale: boolean;
  isValueId: string;
  ghost: boolean;

  constructor(options: Partial<SliderEntry>) {
    Object.assign(this, options);
  }
}

export class WidgetSliderConfig extends BaseWidgetConfig {
  sliderGroups: SliderGroup[];

  constructor() {
    super();
    this.version = WidgetSliderConfigVersion;
    this.sliderGroups = null;
  }
}
