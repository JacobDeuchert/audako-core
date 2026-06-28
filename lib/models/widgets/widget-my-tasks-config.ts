import { BaseWidgetConfig } from './shared.js';

export class WidgetMyTasksConfig extends BaseWidgetConfig {
  constructor(title = '', headerExpanded = false) {
    super();
    this.title = title;
    this.headerExpanded = headerExpanded;
  }
}
