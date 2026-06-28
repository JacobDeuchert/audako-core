import { BaseWidgetConfig } from './shared.js';

export const WidgetCameraConfigVersion = '1';

export class WidgetCameraConfig extends BaseWidgetConfig {
  cameraId: string;
  isLive: boolean;

  constructor() {
    super();
    this.version = WidgetCameraConfigVersion;
  }
}
