import { EntityType } from '../../models/entities/configuration-entity.model.js';
import type { EndpointName, EndpointParams, ServiceUrls } from './endpoint-resolver.js';

/**
 * v4 domain-prefixed entity paths, appended to the structure service root
 * (`{structure}/base/Group`). `Record<EntityType, string>` makes a missing entity type a compile
 * error. `Storage` is intentionally absent: it is no longer a configuration entity in v5 and was
 * dropped from audako-core.
 *
 * The `/alarming/`, `/maintenance/` and `/runtime/` prefixes reproduce exactly what core sent
 * before 2.0; see open item 2 in docs/migration-2.0.md.
 */
export const V4_ENTITY_PATHS: Record<EntityType, string> = {
  [EntityType.Group]: '/base/Group',
  [EntityType.Signal]: '/daq/Signal',
  [EntityType.Formula]: '/daq/Formula',
  [EntityType.Dashboard]: '/base/Dashboard',
  [EntityType.DashboardTab]: '/base/DashboardTab',
  [EntityType.DataConnection]: '/daq/DataConnection',
  [EntityType.DataSource]: '/daq/DataSource',
  [EntityType.Connector]: '/daq/Connector',
  [EntityType.EventCondition]: '/base/condition',
  [EntityType.EventDefinition]: '/base/EventDefinition',
  [EntityType.EventCategory]: '/base/EventCategory',
  [EntityType.ProcessImage]: '/scada/ProcessImage',
  [EntityType.BatchDefinition]: '/scada/batchdefinition',
  [EntityType.ReportTemplate]: '/scada/ReportTemplate',
  [EntityType.Report]: '/scada/Report',
  [EntityType.Document]: '/base/Document',
  [EntityType.Camera]: '/scada/Camera',
  [EntityType.SwitchSchedule]: '/scada/SwitchSchedule',
  [EntityType.User]: '/base/User',
  [EntityType.Role]: '/base/Role',
  [EntityType.Recipient]: '/alarming/Recipient',
  [EntityType.RecipientGroup]: '/alarming/RecipientGroup',
  [EntityType.AlarmingPlan]: '/alarming/AlarmingPlan',
  [EntityType.MaintenanceService]: '/maintenance/MaintenanceService',
  [EntityType.TaskDefinition]: '/maintenance/TaskDefinition',
  [EntityType.RuntimeScript]: '/runtime/RuntimeScript',
};

/**
 * v5 kebab-plural entity segments under the structure service root (`{structure}/groups`).
 * Table taken from the "Entity segment map" in docs/analysis/v4-to-v5-endpoints.md.
 */
export const V5_ENTITY_SEGMENTS: Record<EntityType, string> = {
  [EntityType.Group]: 'groups',
  [EntityType.Signal]: 'signals',
  [EntityType.Formula]: 'formulas',
  [EntityType.Dashboard]: 'dashboards',
  [EntityType.DashboardTab]: 'dashboard-tabs',
  [EntityType.DataConnection]: 'data-connections',
  [EntityType.DataSource]: 'data-sources',
  [EntityType.Connector]: 'connectors',
  [EntityType.EventCondition]: 'conditions',
  [EntityType.EventDefinition]: 'event-definitions',
  [EntityType.EventCategory]: 'event-categories',
  [EntityType.ProcessImage]: 'process-images',
  [EntityType.BatchDefinition]: 'batch-definitions',
  [EntityType.ReportTemplate]: 'report-templates',
  [EntityType.Report]: 'reports',
  [EntityType.Document]: 'documents',
  [EntityType.Camera]: 'cameras',
  [EntityType.SwitchSchedule]: 'switch-schedules',
  [EntityType.User]: 'users',
  [EntityType.Role]: 'roles',
  [EntityType.Recipient]: 'recipients',
  [EntityType.RecipientGroup]: 'recipient-groups',
  [EntityType.AlarmingPlan]: 'alarming-plans',
  [EntityType.MaintenanceService]: 'maintenance-services',
  [EntityType.TaskDefinition]: 'task-definitions',
  [EntityType.RuntimeScript]: 'runtime-scripts',
};

/** HTTP method used for entity queries on v5. */
export const QUERY_METHOD = 'QUERY';

/** Builds the URL of one endpoint on one API version. */
export type UrlBuilder<K extends EndpointName> = (urls: ServiceUrls, params: EndpointParams[K]) => string;

/**
 * One row of the endpoint table.
 *
 * `method` is the verb the endpoint is called with. It is omitted where the caller decides the
 * verb (`entityById` is GET, PUT or DELETE) and given per version where the verb itself changed
 * between v4 and v5 (`entityQuery`, undo/redo). `v4` / `v5` are `null` where the endpoint does not
 * exist on that version.
 */
export interface EndpointDefinition<K extends EndpointName> {
  method?: string | { v4: string; v5: string };
  v4: UrlBuilder<K> | null;
  v5: UrlBuilder<K> | null;
}

export type EndpointTable = { [K in EndpointName]: EndpointDefinition<K> };

/** Entity collection root on either version. */
function entityRoot(urls: ServiceUrls, entityType: EntityType, apiVersion: 'v4' | 'v5'): string {
  return apiVersion === 'v4'
    ? `${urls.structure}${V4_ENTITY_PATHS[entityType]}`
    : `${urls.structure}/${V5_ENTITY_SEGMENTS[entityType]}`;
}

/** Historian value group root: `/value` on v4, `/historical-values` on v5. */
function valueRoot(urls: ServiceUrls, apiVersion: 'v4' | 'v5'): string {
  return apiVersion === 'v4' ? `${urls.historian}/value` : `${urls.historian}/historical-values`;
}

/** Historian operations root, renamed in v5. */
function operationsRoot(urls: ServiceUrls, apiVersion: 'v4' | 'v5'): string {
  return apiVersion === 'v4'
    ? `${urls.historian}/historicalvaluemanipulation/operations`
    : `${urls.historian}/historical-value-operations`;
}

/**
 * Builds a row whose URL only differs in the roots above. `build` receives the version so it can
 * pick the right root; everything after the root is spelled once.
 */
function sameShape<K extends EndpointName>(
  method: string | undefined,
  build: (urls: ServiceUrls, params: EndpointParams[K], apiVersion: 'v4' | 'v5') => string,
): EndpointDefinition<K> {
  return {
    method: method,
    v4: (urls, params) => build(urls, params, 'v4'),
    v5: (urls, params) => build(urls, params, 'v5'),
  };
}

/**
 * Every endpoint audako-core can address, with its v4 (platform 4.12 - 4.23) and v5 (5.x) URL
 * side by side. See docs/analysis/v4-to-v5-endpoints.md for the diff this encodes.
 */
export const ENDPOINTS: EndpointTable = {
  version: sameShape('GET', (urls) => `${urls.structure}/about/version`),

  entityCollection: sameShape('POST', (urls, p, v) => entityRoot(urls, p.entityType, v)),
  // GET / PUT / DELETE: the caller supplies the verb.
  entityById: sameShape(undefined, (urls, p, v) => `${entityRoot(urls, p.entityType, v)}/${p.id}`),
  // v4: POST to a dedicated `/query` sub-path (405 on v5). v5: the QUERY verb on the collection root.
  entityQuery: {
    method: { v4: 'POST', v5: QUERY_METHOD },
    v4: (urls, p) => `${entityRoot(urls, p.entityType, 'v4')}/query`,
    v5: (urls, p) => entityRoot(urls, p.entityType, 'v5'),
  },
  // Additive in v5: replaces the `$projection={"Id":1}` counting hack.
  entityCount: { method: 'GET', v4: null, v5: (urls, p) => `${entityRoot(urls, p.entityType, 'v5')}/count` },
  // Additive in v5: replaces the per-id lookups in EntityNameService.
  entityInfo: { method: 'GET', v4: null, v5: (urls, p) => `${entityRoot(urls, p.entityType, 'v5')}/entity-info` },
  // Mutating GETs on both versions.
  entityCopy: sameShape(
    'GET',
    (urls, p, v) => `${entityRoot(urls, p.entityType, v)}/copy/${p.sourceId}/to/${p.targetId}`,
  ),
  entityCopyMultiple: sameShape(
    'PUT',
    (urls, p, v) => `${entityRoot(urls, p.entityType, v)}/copy/multiple/${p.targetId}`,
  ),
  entityMove: sameShape(
    'GET',
    (urls, p, v) => `${entityRoot(urls, p.entityType, v)}/move/${p.sourceId}/to/${p.targetId}`,
  ),
  entityMoveMultiple: sameShape(
    'PUT',
    (urls, p, v) => `${entityRoot(urls, p.entityType, v)}/move/multiple/${p.targetId}`,
  ),
  // The rendering route, not the generic entity file upload: it stores the raw image and renders
  // it (v5 also fills in block instances).
  processImageUpload: {
    method: 'PUT',
    v4: (urls, p) => `${urls.structure}/processimagerender/upload/${p.id}`,
    v5: (urls, p) => `${urls.structure}/process-image-rendering/upload/${p.id}`,
  },

  // v4 tenant routes are singular (`/tenant/...`), v5 plural, and `tenant/entity` became
  // `tenants/entities`.
  tenantViewById: {
    method: 'GET',
    v4: (urls, p) => `${urls.structure}/tenant/${p.tenantId}/view`,
    v5: (urls, p) => `${urls.structure}/tenants/${p.tenantId}/view`,
  },
  tenantViewForEntity: {
    method: 'GET',
    v4: (urls, p) => `${urls.structure}/tenant/entity/${p.entityId}/view`,
    v5: (urls, p) => `${urls.structure}/tenants/entities/${p.entityId}/view`,
  },
  tenantsTop: {
    method: 'GET',
    v4: (urls) => `${urls.structure}/tenant/top`,
    v5: (urls) => `${urls.structure}/tenants/top`,
  },
  tenantsNext: {
    method: 'GET',
    v4: (urls, p) => `${urls.structure}/tenant/${p.tenantId}/next`,
    v5: (urls, p) => `${urls.structure}/tenants/${p.tenantId}/next`,
  },
  tenantsFilter: {
    method: 'GET',
    v4: (urls, p) => `${urls.structure}/tenant/filter/${p.filter}`,
    v5: (urls, p) => `${urls.structure}/tenants/filter/${p.filter}`,
  },

  // GET / PUT; v4 spells the profile as one word.
  userProfile: {
    v4: (urls) => `${urls.structure}/userprofile`,
    v5: (urls) => `${urls.structure}/user-profile`,
  },

  // `/value/manyflat` -> `historical-values/query-many-flat`, `/value/many` -> `query-many`.
  historicalValuesQueryManyFlat: {
    method: 'POST',
    v4: (urls) => `${valueRoot(urls, 'v4')}/manyflat`,
    v5: (urls) => `${valueRoot(urls, 'v5')}/query-many-flat`,
  },
  historicalValuesQueryMany: {
    method: 'POST',
    v4: (urls) => `${valueRoot(urls, 'v4')}/many`,
    v5: (urls) => `${valueRoot(urls, 'v5')}/query-many`,
  },
  historicalValuesNearest: sameShape('POST', (urls, _p, v) => `${valueRoot(urls, v)}/nearest`),
  historicalValuesNth: sameShape('POST', (urls, _p, v) => `${valueRoot(urls, v)}/nth`),
  historicalValuesManual: sameShape('POST', (urls, _p, v) => `${valueRoot(urls, v)}/manual`),
  // Pluralized in v5.
  historicalValuesNotes: {
    method: 'POST',
    v4: (urls) => `${valueRoot(urls, 'v4')}/note`,
    v5: (urls) => `${valueRoot(urls, 'v5')}/notes`,
  },
  // `/value/counter/{id}` -> `historical-values/counters/{id}`. No legacy rewrite covers the
  // `custom` paths on v5, so the v5 URL must be used (it 404s otherwise).
  counterOffsets: {
    method: 'GET',
    v4: (urls, p) => `${valueRoot(urls, 'v4')}/counter/${p.signalId}/offsets`,
    v5: (urls, p) => `${valueRoot(urls, 'v5')}/counters/${p.signalId}/offsets`,
  },
  counterOffsetsCustom: {
    method: 'POST',
    v4: (urls, p) => `${valueRoot(urls, 'v4')}/counter/${p.signalId}/offsets/custom`,
    v5: (urls, p) => `${valueRoot(urls, 'v5')}/counters/${p.signalId}/offsets/custom`,
  },
  counterOffsetsRemove: {
    method: 'POST',
    v4: (urls, p) => `${valueRoot(urls, 'v4')}/counter/${p.signalId}/offsets/remove`,
    v5: (urls, p) => `${valueRoot(urls, 'v5')}/counters/${p.signalId}/offsets/remove`,
  },
  counterOffsetsCustomRemove: {
    method: 'POST',
    v4: (urls, p) => `${valueRoot(urls, 'v4')}/counter/${p.signalId}/offsets/custom/remove`,
    v5: (urls, p) => `${valueRoot(urls, 'v5')}/counters/${p.signalId}/offsets/custom/remove`,
  },
  statisticsReset: sameShape('POST', (urls, p, v) => `${valueRoot(urls, v)}/statistics/${p.signalId}/reset`),
  // v4 import endpoint has its own `/import` action; v5 posts to the collection root.
  historicalValueImport: {
    method: 'POST',
    v4: (urls) => `${urls.historian}/historicalvalueimport/import`,
    v5: (urls) => `${urls.historian}/historical-value-imports`,
  },

  // `/historicalvaluemanipulation/operations` -> `/historical-value-operations`.
  historicalValueOperations: sameShape('GET', (urls, p, v) => `${operationsRoot(urls, v)}/${p.signalId}`),
  historicalValueOperationStart: sameShape(
    'POST',
    (urls, p, v) => `${operationsRoot(urls, v)}/${p.signalId}/start`,
  ),
  // v4 accepts only PUT for undo/redo; v5 prefers POST (PUT is kept as a legacy alias).
  historicalValueOperationUndo: {
    method: { v4: 'PUT', v5: 'POST' },
    v4: (urls, p) => `${operationsRoot(urls, 'v4')}/${p.operationId}/undo`,
    v5: (urls, p) => `${operationsRoot(urls, 'v5')}/${p.operationId}/undo`,
  },
  historicalValueOperationRedo: {
    method: { v4: 'PUT', v5: 'POST' },
    v4: (urls, p) => `${operationsRoot(urls, 'v4')}/${p.operationId}/redo`,
    v5: (urls, p) => `${operationsRoot(urls, 'v5')}/${p.operationId}/redo`,
  },

  driverConfigureDataSource: sameShape(
    'GET',
    (urls, p) => `${urls.driver}/command/source/${p.dataSourceId}/configure`,
  ),
  driverBrowseConnection: sameShape('POST', (urls, p) => `${urls.driver}/command/conn/${p.dataConnectionId}/browse`),

  // SignalR hub, not an HTTP endpoint: `hub` -> `values`. `Services.Live` has no `/v1` yet, so
  // the URL still resolves through the live service's catch-all rewrite; keep reading the path
  // from config.
  liveHub: {
    v4: (urls) => `${urls.live}/hub`,
    v5: (urls) => `${urls.live}/values`,
  },
};
