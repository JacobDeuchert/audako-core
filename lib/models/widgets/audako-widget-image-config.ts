import { BaseWidgetConfig } from './shared.js';

export const AudakoWidgetImageConfigVersion = '2';

export class AudakoWidgetImageConfig extends BaseWidgetConfig {
  selectedImage: string;

  constructor() {
    super();
    this.version = AudakoWidgetImageConfigVersion;
  }
}
