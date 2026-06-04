"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTypeClassMapping = void 0;
const alarming_plan_model_js_1 = require("./entities/alarming-plan.model.js");
const batch_definition_model_js_1 = require("./entities/batch-definition.model.js");
const camera_model_js_1 = require("./entities/camera.model.js");
const configuration_entity_model_js_1 = require("./entities/configuration-entity.model.js");
const connector_model_js_1 = require("./entities/connector.model.js");
const dashboard_tab_model_js_1 = require("./entities/dashboard-tab.model.js");
const dashboard_model_js_1 = require("./entities/dashboard.model.js");
const data_connection_model_js_1 = require("./entities/data-connection.model.js");
const data_source_model_js_1 = require("./entities/data-source.model.js");
const document_model_js_1 = require("./entities/document.model.js");
const event_category_model_js_1 = require("./entities/event-category.model.js");
const event_condition_model_js_1 = require("./entities/event-condition.model.js");
const event_definition_model_js_1 = require("./entities/event-definition.model.js");
const formula_model_js_1 = require("./entities/formula.model.js");
const group_model_js_1 = require("./entities/group.model.js");
const maintenance_service_model_js_1 = require("./entities/maintenance-service.model.js");
const process_image_model_js_1 = require("./entities/process-image.model.js");
const recipient_model_js_1 = require("./entities/recipient.model.js");
const recipient_group_model_js_1 = require("./entities/recipient-group.model.js");
const report_model_js_1 = require("./entities/report.model.js");
const report_template_model_js_1 = require("./entities/report-template.model.js");
const role_model_js_1 = require("./entities/role.model.js");
const runtime_script_model_js_1 = require("./entities/runtime-script.model.js");
const signal_model_js_1 = require("./entities/signal.model.js");
const storage_model_js_1 = require("./entities/storage.model.js");
const switch_schedule_model_js_1 = require("./entities/switch-schedule.model.js");
const task_definition_model_js_1 = require("./entities/task-definition.model.js");
const user_model_js_1 = require("./entities/user.model.js");
exports.EntityTypeClassMapping = {
    [configuration_entity_model_js_1.EntityType.Group]: group_model_js_1.Group,
    [configuration_entity_model_js_1.EntityType.Signal]: signal_model_js_1.Signal,
    [configuration_entity_model_js_1.EntityType.Dashboard]: dashboard_model_js_1.Dashboard,
    [configuration_entity_model_js_1.EntityType.DashboardTab]: dashboard_tab_model_js_1.DashboardTab,
    [configuration_entity_model_js_1.EntityType.DataConnection]: data_connection_model_js_1.DataConnection,
    [configuration_entity_model_js_1.EntityType.DataSource]: data_source_model_js_1.DataSource,
    [configuration_entity_model_js_1.EntityType.Connector]: connector_model_js_1.Connector,
    [configuration_entity_model_js_1.EntityType.EventCategory]: event_category_model_js_1.EventCategory,
    [configuration_entity_model_js_1.EntityType.EventCondition]: event_condition_model_js_1.EventCondition,
    [configuration_entity_model_js_1.EntityType.EventDefinition]: event_definition_model_js_1.EventDefinition,
    [configuration_entity_model_js_1.EntityType.Formula]: formula_model_js_1.Formula,
    [configuration_entity_model_js_1.EntityType.ProcessImage]: process_image_model_js_1.ProcessImage,
    [configuration_entity_model_js_1.EntityType.BatchDefinition]: batch_definition_model_js_1.BatchDefinition,
    [configuration_entity_model_js_1.EntityType.ReportTemplate]: report_template_model_js_1.ReportTemplate,
    [configuration_entity_model_js_1.EntityType.Report]: report_model_js_1.Report,
    [configuration_entity_model_js_1.EntityType.Document]: document_model_js_1.Document,
    [configuration_entity_model_js_1.EntityType.Storage]: storage_model_js_1.Storage,
    [configuration_entity_model_js_1.EntityType.Camera]: camera_model_js_1.Camera,
    [configuration_entity_model_js_1.EntityType.SwitchSchedule]: switch_schedule_model_js_1.SwitchSchedule,
    [configuration_entity_model_js_1.EntityType.User]: user_model_js_1.User,
    [configuration_entity_model_js_1.EntityType.Role]: role_model_js_1.Role,
    [configuration_entity_model_js_1.EntityType.Recipient]: recipient_model_js_1.Recipient,
    [configuration_entity_model_js_1.EntityType.RecipientGroup]: recipient_group_model_js_1.RecipientGroup,
    [configuration_entity_model_js_1.EntityType.AlarmingPlan]: alarming_plan_model_js_1.AlarmingPlan,
    [configuration_entity_model_js_1.EntityType.MaintenanceService]: maintenance_service_model_js_1.MaintenanceService,
    [configuration_entity_model_js_1.EntityType.TaskDefinition]: task_definition_model_js_1.TaskDefinition,
    [configuration_entity_model_js_1.EntityType.RuntimeScript]: runtime_script_model_js_1.RuntimeScript,
};
