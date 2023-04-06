"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTypeClassMapping = void 0;
const batch_definition_model_js_1 = require("./entities/batch-definition.model.js");
const configuration_entity_model_js_1 = require("./entities/configuration-entity.model.js");
const dashboard_tab_model_js_1 = require("./entities/dashboard-tab.model.js");
const dashboard_model_js_1 = require("./entities/dashboard.model.js");
const data_connection_model_js_1 = require("./entities/data-connection.model.js");
const data_source_model_js_1 = require("./entities/data-source.model.js");
const event_category_model_js_1 = require("./entities/event-category.model.js");
const event_condition_model_js_1 = require("./entities/event-condition.model.js");
const event_definition_model_js_1 = require("./entities/event-definition.model.js");
const formula_model_js_1 = require("./entities/formula.model.js");
const group_model_js_1 = require("./entities/group.model.js");
const process_image_model_js_1 = require("./entities/process-image.model.js");
const signal_model_js_1 = require("./entities/signal.model.js");
exports.EntityTypeClassMapping = {
    [configuration_entity_model_js_1.EntityType.Group]: group_model_js_1.Group,
    [configuration_entity_model_js_1.EntityType.Signal]: signal_model_js_1.Signal,
    [configuration_entity_model_js_1.EntityType.Dashboard]: dashboard_model_js_1.Dashboard,
    [configuration_entity_model_js_1.EntityType.DashboardTab]: dashboard_tab_model_js_1.DashboardTab,
    [configuration_entity_model_js_1.EntityType.DataConnection]: data_connection_model_js_1.DataConnection,
    [configuration_entity_model_js_1.EntityType.DataSource]: data_source_model_js_1.DataSource,
    [configuration_entity_model_js_1.EntityType.EventCategory]: event_category_model_js_1.EventCategory,
    [configuration_entity_model_js_1.EntityType.EventCondition]: event_condition_model_js_1.EventCondition,
    [configuration_entity_model_js_1.EntityType.EventDefinition]: event_definition_model_js_1.EventDefinition,
    [configuration_entity_model_js_1.EntityType.Formula]: formula_model_js_1.Formula,
    [configuration_entity_model_js_1.EntityType.ProcessImage]: process_image_model_js_1.ProcessImage,
    [configuration_entity_model_js_1.EntityType.BatchDefinition]: batch_definition_model_js_1.BatchDefinition
};
