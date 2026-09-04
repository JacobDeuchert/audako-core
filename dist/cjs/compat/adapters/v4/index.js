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
exports.registerV4Adapters = exports.V4_ADAPTED_ENTITY_TYPES = void 0;
const configuration_entity_model_js_1 = require("../../../models/entities/configuration-entity.model.js");
const entity_adapter_js_1 = require("../entity-adapter.js");
const batch_definition_adapter_v4_js_1 = require("./batch-definition.adapter.v4.js");
const dashboard_tab_adapter_v4_js_1 = require("./dashboard-tab.adapter.v4.js");
const event_category_adapter_v4_js_1 = require("./event-category.adapter.v4.js");
const event_definition_adapter_v4_js_1 = require("./event-definition.adapter.v4.js");
const runtime_script_adapter_v4_js_1 = require("./runtime-script.adapter.v4.js");
__exportStar(require("./batch-definition.adapter.v4.js"), exports);
__exportStar(require("./dashboard-tab.adapter.v4.js"), exports);
__exportStar(require("./event-category.adapter.v4.js"), exports);
__exportStar(require("./event-definition.adapter.v4.js"), exports);
__exportStar(require("./runtime-script.adapter.v4.js"), exports);
/**
 * Entity types that have a v4 adapter. Everything else uses the identity adapter, either because
 * the wire shape is unchanged across 4.12 - 5.x or because the difference is data loss that a
 * feature flag has to gate instead:
 *
 * - `TranslatableField.Translations` (< 4.16, feature `translations`): pre-4.16 servers never
 *   emitted `Translations` and drop it on write, so translations are *unsupported*, not empty.
 *   No adapter, and `Translations` is deliberately **not** stripped on writes below 4.16 - the
 *   server ignores the unknown key, the write does not fail, and stripping it would only hide
 *   from the caller that the data went nowhere.
 * - `DashboardTab.EntityMappings` (< 4.15, feature `entityMappings`): see the adapter comment.
 */
exports.V4_ADAPTED_ENTITY_TYPES = [
    configuration_entity_model_js_1.EntityType.BatchDefinition,
    configuration_entity_model_js_1.EntityType.DashboardTab,
    configuration_entity_model_js_1.EntityType.EventCategory,
    configuration_entity_model_js_1.EntityType.EventDefinition,
    configuration_entity_model_js_1.EntityType.RuntimeScript,
];
/**
 * Registers every v4 entity adapter. Called once at module load from
 * `lib/compat/adapters/index.ts`; pass a registry explicitly in tests.
 *
 * The adapters branch on the exact platform version themselves and are identity on v5, so
 * registering them unconditionally is safe - there is no per-connection registry.
 */
function registerV4Adapters(registry = entity_adapter_js_1.entityAdapters) {
    return registry
        .register(configuration_entity_model_js_1.EntityType.BatchDefinition, batch_definition_adapter_v4_js_1.batchDefinitionAdapterV4)
        .register(configuration_entity_model_js_1.EntityType.DashboardTab, dashboard_tab_adapter_v4_js_1.dashboardTabAdapterV4)
        .register(configuration_entity_model_js_1.EntityType.EventCategory, event_category_adapter_v4_js_1.eventCategoryAdapterV4)
        .register(configuration_entity_model_js_1.EntityType.EventDefinition, event_definition_adapter_v4_js_1.eventDefinitionAdapterV4)
        .register(configuration_entity_model_js_1.EntityType.RuntimeScript, runtime_script_adapter_v4_js_1.runtimeScriptAdapterV4);
}
exports.registerV4Adapters = registerV4Adapters;
