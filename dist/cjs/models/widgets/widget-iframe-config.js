"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetIframeConfig = exports.WidgetIframeVersion = exports.IframeLoadingMethods = exports.PermissionsPolicyAllowList = void 0;
const shared_js_1 = require("./shared.js");
/**
 * Defines all currently (06.07.2021) available options on the allow list
 * @access public
 * @since  06.07.2021
 * @see    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#syntax
 * @enum   PermissionsPolicyAllowList
 */
var PermissionsPolicyAllowList;
(function (PermissionsPolicyAllowList) {
    PermissionsPolicyAllowList["STAR"] = "*";
    PermissionsPolicyAllowList["SELF"] = "self";
    PermissionsPolicyAllowList["SRC"] = "src";
    PermissionsPolicyAllowList["NONE"] = "none";
    PermissionsPolicyAllowList["ORIGINS"] = "origins";
})(PermissionsPolicyAllowList || (exports.PermissionsPolicyAllowList = PermissionsPolicyAllowList = {}));
/**
 * Defines all possible loading methods of the iframe
 * @access public
 * @example
 *   LAZY  => As long as the iframe didnt hit the viewport through the intersection observer it wont be loaded
 *   EAGER => Load it as soon the page was loaded
 *   AUTO  => Let the Browser decide when to load the iframe
 * @enum IframeLoadingMethods
 */
var IframeLoadingMethods;
(function (IframeLoadingMethods) {
    IframeLoadingMethods["LAZY"] = "lazy";
    IframeLoadingMethods["EAGER"] = "eager";
    IframeLoadingMethods["AUTO"] = "auto";
})(IframeLoadingMethods || (exports.IframeLoadingMethods = IframeLoadingMethods = {}));
exports.WidgetIframeVersion = '1';
class WidgetIframeConfig extends shared_js_1.BaseWidgetConfig {
    constructor() {
        super();
        this.title = '';
        this.version = exports.WidgetIframeVersion;
        this.headerExpanded = false;
        this.permissions = '';
        this.restrictions = [];
        this.src = null;
        this.loadingMethod = 'auto';
    }
}
exports.WidgetIframeConfig = WidgetIframeConfig;
