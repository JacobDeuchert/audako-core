"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4_ENDPOINTS = exports.V4_ENTITY_PATHS = void 0;
const configuration_entity_model_js_1 = require("../../models/entities/configuration-entity.model.js");
/**
 * v4 domain-prefixed entity paths, appended to the structure service root
 * (`{structure}/base/Group`). Mirrors `V5_ENTITY_SEGMENTS`; `Record<EntityType, string>` makes a
 * missing entity type a compile error. `Storage` is intentionally absent: it is no longer a
 * configuration entity in v5 and was dropped from audako-core.
 *
 * The `/alarming/`, `/maintenance/` and `/runtime/` prefixes reproduce exactly what core sent
 * before 2.0; see open item 2 in docs/migration-2.0.md.
 */
exports.V4_ENTITY_PATHS = {
    [configuration_entity_model_js_1.EntityType.Group]: '/base/Group',
    [configuration_entity_model_js_1.EntityType.Signal]: '/daq/Signal',
    [configuration_entity_model_js_1.EntityType.Formula]: '/daq/Formula',
    [configuration_entity_model_js_1.EntityType.Dashboard]: '/base/Dashboard',
    [configuration_entity_model_js_1.EntityType.DashboardTab]: '/base/DashboardTab',
    [configuration_entity_model_js_1.EntityType.DataConnection]: '/daq/DataConnection',
    [configuration_entity_model_js_1.EntityType.DataSource]: '/daq/DataSource',
    [configuration_entity_model_js_1.EntityType.Connector]: '/daq/Connector',
    [configuration_entity_model_js_1.EntityType.EventCondition]: '/base/condition',
    [configuration_entity_model_js_1.EntityType.EventDefinition]: '/base/EventDefinition',
    [configuration_entity_model_js_1.EntityType.EventCategory]: '/base/EventCategory',
    [configuration_entity_model_js_1.EntityType.ProcessImage]: '/scada/ProcessImage',
    [configuration_entity_model_js_1.EntityType.BatchDefinition]: '/scada/batchdefinition',
    [configuration_entity_model_js_1.EntityType.ReportTemplate]: '/scada/ReportTemplate',
    [configuration_entity_model_js_1.EntityType.Report]: '/scada/Report',
    [configuration_entity_model_js_1.EntityType.Document]: '/base/Document',
    [configuration_entity_model_js_1.EntityType.Camera]: '/scada/Camera',
    [configuration_entity_model_js_1.EntityType.SwitchSchedule]: '/scada/SwitchSchedule',
    [configuration_entity_model_js_1.EntityType.User]: '/base/User',
    [configuration_entity_model_js_1.EntityType.Role]: '/base/Role',
    [configuration_entity_model_js_1.EntityType.Recipient]: '/alarming/Recipient',
    [configuration_entity_model_js_1.EntityType.RecipientGroup]: '/alarming/RecipientGroup',
    [configuration_entity_model_js_1.EntityType.AlarmingPlan]: '/alarming/AlarmingPlan',
    [configuration_entity_model_js_1.EntityType.MaintenanceService]: '/maintenance/MaintenanceService',
    [configuration_entity_model_js_1.EntityType.TaskDefinition]: '/maintenance/TaskDefinition',
    [configuration_entity_model_js_1.EntityType.RuntimeScript]: '/runtime/RuntimeScript',
};
function get(url) {
    return { url: url, method: 'GET' };
}
/** v4 entity collection root: `{structure}/{domain}/{Type}` from `V4_ENTITY_PATHS`. */
function entityRoot(urls, entityType) {
    return `${urls.structure}${exports.V4_ENTITY_PATHS[entityType]}`;
}
/** Historian value group root. All v4 value endpoints hang under `/value`. */
function valueRoot(urls) {
    return `${urls.historian}/value`;
}
/** v4 endpoint table (platform 4.12 - 4.23). See docs/analysis/v4-to-v5-endpoints.md. */
exports.V4_ENDPOINTS = {
    version: (urls) => get(`${urls.structure}/about/version`),
    entityCollection: (urls, p) => ({ url: entityRoot(urls, p.entityType), method: 'POST' }),
    entityById: (urls, p) => get(`${entityRoot(urls, p.entityType)}/${p.id}`),
    // v4: query is a POST to a dedicated `/query` sub-path; v5 uses the QUERY verb on the root.
    entityQuery: (urls, p) => ({ url: `${entityRoot(urls, p.entityType)}/query`, method: 'POST' }),
    // v5 only: no count/entity-info endpoints exist on v4.
    entityCount: null,
    entityInfo: null,
    entityCopy: (urls, p) => get(`${entityRoot(urls, p.entityType)}/copy/${p.sourceId}/to/${p.targetId}`),
    entityCopyMultiple: (urls, p) => ({
        url: `${entityRoot(urls, p.entityType)}/copy/multiple/${p.targetId}`,
        method: 'PUT',
    }),
    entityMove: (urls, p) => get(`${entityRoot(urls, p.entityType)}/move/${p.sourceId}/to/${p.targetId}`),
    entityMoveMultiple: (urls, p) => ({
        url: `${entityRoot(urls, p.entityType)}/move/multiple/${p.targetId}`,
        method: 'PUT',
    }),
    // v4 carries an extra `/file` segment that v5 dropped.
    processImageUpload: (urls, p) => ({
        url: `${entityRoot(urls, configuration_entity_model_js_1.EntityType.ProcessImage)}/${p.id}/file/image`,
        method: 'POST',
    }),
    // v4 tenant routes are singular: `/tenant/...` vs v5 `/tenants/...`.
    tenantViewById: (urls, p) => get(`${urls.structure}/tenant/${p.tenantId}/view`),
    tenantViewForEntity: (urls, p) => get(`${urls.structure}/tenant/entity/${p.entityId}/view`),
    tenantsTop: (urls) => get(`${urls.structure}/tenant/top`),
    tenantsNext: (urls, p) => get(`${urls.structure}/tenant/${p.tenantId}/next`),
    tenantsFilter: (urls, p) => get(`${urls.structure}/tenant/filter/${p.filter}`),
    // v4 spells the user profile as one word; v5 uses `user-profile`.
    userProfile: (urls) => get(`${urls.structure}/userprofile`),
    historicalValuesQueryManyFlat: (urls) => ({ url: `${valueRoot(urls)}/manyflat`, method: 'POST' }),
    historicalValuesQueryMany: (urls) => ({ url: `${valueRoot(urls)}/many`, method: 'POST' }),
    historicalValuesNearest: (urls) => ({ url: `${valueRoot(urls)}/nearest`, method: 'POST' }),
    historicalValuesNth: (urls) => ({ url: `${valueRoot(urls)}/nth`, method: 'POST' }),
    historicalValuesManual: (urls) => ({ url: `${valueRoot(urls)}/manual`, method: 'POST' }),
    // v4 note endpoint is singular; v5 pluralized it to `notes`.
    historicalValuesNotes: (urls) => ({ url: `${valueRoot(urls)}/note`, method: 'POST' }),
    // v4 counter offsets live under `/value/counter/{id}`; v5 under `historical-values/counters/{id}`.
    counterOffsets: (urls, p) => get(`${valueRoot(urls)}/counter/${p.signalId}/offsets`),
    counterOffsetsCustom: (urls, p) => ({
        url: `${valueRoot(urls)}/counter/${p.signalId}/offsets/custom`,
        method: 'POST',
    }),
    counterOffsetsRemove: (urls, p) => ({
        url: `${valueRoot(urls)}/counter/${p.signalId}/offsets/remove`,
        method: 'POST',
    }),
    counterOffsetsCustomRemove: (urls, p) => ({
        url: `${valueRoot(urls)}/counter/${p.signalId}/offsets/custom/remove`,
        method: 'POST',
    }),
    statisticsReset: (urls, p) => ({
        url: `${valueRoot(urls)}/statistics/${p.signalId}/reset`,
        method: 'POST',
    }),
    // v4 import endpoint has its own `/import` action; v5 posts to the collection root.
    historicalValueImport: (urls) => ({
        url: `${urls.historian}/historicalvalueimport/import`,
        method: 'POST',
    }),
    // v4: `/historicalvaluemanipulation/operations/...`; v5: `/historical-value-operations/...`.
    historicalValueOperations: (urls, p) => get(`${urls.historian}/historicalvaluemanipulation/operations/${p.signalId}`),
    historicalValueOperationStart: (urls, p) => ({
        url: `${urls.historian}/historicalvaluemanipulation/operations/${p.signalId}/start`,
        method: 'POST',
    }),
    // v4 accepts only PUT for undo/redo; v5 prefers POST (PUT is kept as a legacy alias).
    historicalValueOperationUndo: (urls, p) => ({
        url: `${urls.historian}/historicalvaluemanipulation/operations/${p.operationId}/undo`,
        method: 'PUT',
    }),
    historicalValueOperationRedo: (urls, p) => ({
        url: `${urls.historian}/historicalvaluemanipulation/operations/${p.operationId}/redo`,
        method: 'PUT',
    }),
    driverConfigureDataSource: (urls, p) => get(`${urls.driver}/command/source/${p.dataSourceId}/configure`),
    driverBrowseConnection: (urls, p) => ({
        url: `${urls.driver}/command/conn/${p.dataConnectionId}/browse`,
        method: 'POST',
    }),
    // v4 hub segment is `hub`; v5 renamed it to `values`.
    liveHub: (urls) => ({ url: `${urls.live}/hub`, method: 'HUB' }),
};
