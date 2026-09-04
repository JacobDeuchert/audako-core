"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_adapter_js_1 = require("./entity-adapter.js");
const index_js_1 = require("./v4/index.js");
__exportStar(require("./entity-adapter.js"), exports);
__exportStar(require("./v4/index.js"), exports);
/**
 * Entry point for the adapter layer. Importing anything from here (in practice `entityAdapters`,
 * which `EntityHttpService` uses) registers the v4 adapters exactly once, as a module side effect.
 *
 * Import graph: `entity-adapter.ts` (registry, no adapter imports) <- `v4/*` <- `v4/index.ts` <-
 * this file. `entity-adapter.ts` must stay free of imports from `v4/`, otherwise registration
 * would depend on module evaluation order.
 */
(0, index_js_1.registerV4Adapters)(entity_adapter_js_1.entityAdapters);
