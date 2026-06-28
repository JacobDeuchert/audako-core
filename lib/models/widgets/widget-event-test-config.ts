import { BaseWidgetConfig } from './shared.js';

export const WidgetEventTestConfigVersion = '1';

export class WidgetEventTestConfig extends BaseWidgetConfig {
  Events: string[];

  constructor() {
    super();

    this.Events = [];
    this.version = WidgetEventTestConfigVersion;
  }
}
