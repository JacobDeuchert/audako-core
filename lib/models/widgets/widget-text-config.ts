import { BaseWidgetConfig } from './shared.js';

export const WidgetTextConfigVersion = '1';

export class WidgetTextConfig extends BaseWidgetConfig {
  text: string;

  constructor() {
    super();

    this.version = '1';
    this.headerExpanded = false;
  }
}
