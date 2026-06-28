import { BaseWidgetConfig } from './shared.js';

export const WidgetTypePlateConfigVersion = '1';

export class WidgetTypePlateConfig extends BaseWidgetConfig {
  groupId: string;

  constructor(options?: Partial<WidgetTypePlateConfig>) {
    super();
    this.version = WidgetTypePlateConfigVersion;

    if (options) {
      Object.assign(this, options);
    }
  }
}
