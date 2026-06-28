import { BaseWidgetConfig } from './shared.js';

/**
 * Defines all currently (06.07.2021) available options on the allow list
 * @access public
 * @since  06.07.2021
 * @see    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#syntax
 * @enum   PermissionsPolicyAllowList
 */
export enum PermissionsPolicyAllowList {
  STAR = '*',
  SELF = 'self',
  SRC = 'src',
  NONE = 'none',
  ORIGINS = 'origins',
}

/**
 * Defines all possible loading methods of the iframe
 * @access public
 * @example
 *   LAZY  => As long as the iframe didnt hit the viewport through the intersection observer it wont be loaded
 *   EAGER => Load it as soon the page was loaded
 *   AUTO  => Let the Browser decide when to load the iframe
 * @enum IframeLoadingMethods
 */
export enum IframeLoadingMethods {
  LAZY = 'lazy',
  EAGER = 'eager',
  AUTO = 'auto',
}

export const WidgetIframeVersion: string = '1';

export class WidgetIframeConfig extends BaseWidgetConfig {
  /**
   * The features/permissions that the iframe has and can access from the parent context
   * @access public
   * @property {string} permissions
   */
  permissions: string;

  /**
   * The restrictions that the iframe has (`sandbox` attribute)
   * @access public
   * @property {string} restrictions
   */
  restrictions: string[];

  src: string;

  loadingMethod: 'eager' | 'lazy' | 'auto';

  constructor() {
    super();
    this.title = '';
    this.version = WidgetIframeVersion;
    this.headerExpanded = false;

    this.permissions = '';
    this.restrictions = [];
    this.src = null;
    this.loadingMethod = 'auto';
  }
}
