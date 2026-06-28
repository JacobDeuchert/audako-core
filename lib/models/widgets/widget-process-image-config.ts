import { BaseWidgetConfig } from './shared.js';

export const WidgetProcessImageConfigVersion = '3';

export class WidgetProcessImageConfig extends BaseWidgetConfig {
  processImageId: string;
  backgroundColor: string = null;

  basetag: string;

  crossTabs: boolean;
  mode: CrossTabMode;
  transferToken: string;

  preloadImages: boolean;

  constructor() {
    super();
    this.version = WidgetProcessImageConfigVersion;
    this.mode = CrossTabMode.Receive;
    this.backgroundColor = '#ffffff';
    this.transferToken = null;
    this.crossTabs = false;
  }
}

export enum CrossTabMode {
  Send = 'Send',
  Receive = 'Receive',
}
