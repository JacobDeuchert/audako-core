import { EntityType } from '../../models/entities/configuration-entity.model.js';
import { EndpointTable, ResolvedEndpoint, ServiceUrls } from './endpoint-resolver.js';

/**
 * v4 domain-prefixed entity paths (`/base/Group`) became kebab-plural segments under the
 * structure service root. Table taken from the "Entity segment map" in
 * docs/analysis/v4-to-v5-endpoints.md. `Storage` is intentionally absent: it is no longer a
 * configuration entity in v5 and was dropped from audako-core.
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

function get(url: string): ResolvedEndpoint {
  return { url: url, method: 'GET' };
}

/** v5 entity collection root: `{structure}/{kebab-plural}`. */
function entityRoot(urls: ServiceUrls, entityType: EntityType): string {
  return `${urls.structure}/${V5_ENTITY_SEGMENTS[entityType]}`;
}

/** Historian value group root. v5 moved all value endpoints under `historical-values`. */
function valueRoot(urls: ServiceUrls): string {
  return `${urls.historian}/historical-values`;
}

/** v5 endpoint table (platform 5.x). See docs/analysis/v4-to-v5-endpoints.md. */
export const V5_ENDPOINTS: EndpointTable = {
  version: (urls) => get(`${urls.structure}/about/version`),

  entityCollection: (urls, p) => ({ url: entityRoot(urls, p.entityType), method: 'POST' }),
  entityById: (urls, p) => get(`${entityRoot(urls, p.entityType)}/${p.id}`),
  // The `/query` sub-path is gone (405). v5 uses the QUERY verb on the collection root and
  // expects `$projection` in the query string instead of the body.
  entityQuery: (urls, p) => ({ url: entityRoot(urls, p.entityType), method: QUERY_METHOD }),
  // Additive in v5: replaces the `$projection={"Id":1}` counting hack.
  entityCount: (urls, p) => get(`${entityRoot(urls, p.entityType)}/count`),
  // Additive in v5: replaces the per-id lookups in EntityNameService.
  entityInfo: (urls, p) => get(`${entityRoot(urls, p.entityType)}/entity-info`),
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
  // v5 dropped the `/file` segment from the upload path.
  processImageUpload: (urls, p) => ({
    url: `${entityRoot(urls, EntityType.ProcessImage)}/${p.id}/image`,
    method: 'POST',
  }),

  // Tenant routes are plural in v5, and `tenant/entity` became `tenants/entities`.
  tenantViewById: (urls, p) => get(`${urls.structure}/tenants/${p.tenantId}/view`),
  tenantViewForEntity: (urls, p) => get(`${urls.structure}/tenants/entities/${p.entityId}/view`),
  tenantsTop: (urls) => get(`${urls.structure}/tenants/top`),
  tenantsNext: (urls, p) => get(`${urls.structure}/tenants/${p.tenantId}/next`),
  tenantsFilter: (urls, p) => get(`${urls.structure}/tenants/filter/${p.filter}`),

  // `userprofile` -> `user-profile`.
  userProfile: (urls) => get(`${urls.structure}/user-profile`),

  // `/value/manyflat` -> `historical-values/query-many-flat`, `/value/many` -> `query-many`.
  historicalValuesQueryManyFlat: (urls) => ({
    url: `${valueRoot(urls)}/query-many-flat`,
    method: 'POST',
  }),
  historicalValuesQueryMany: (urls) => ({ url: `${valueRoot(urls)}/query-many`, method: 'POST' }),
  historicalValuesNearest: (urls) => ({ url: `${valueRoot(urls)}/nearest`, method: 'POST' }),
  historicalValuesNth: (urls) => ({ url: `${valueRoot(urls)}/nth`, method: 'POST' }),
  historicalValuesManual: (urls) => ({ url: `${valueRoot(urls)}/manual`, method: 'POST' }),
  // Pluralized in v5.
  historicalValuesNotes: (urls) => ({ url: `${valueRoot(urls)}/notes`, method: 'POST' }),
  // `/value/counter/{id}` -> `historical-values/counters/{id}`.
  counterOffsets: (urls, p) => get(`${valueRoot(urls)}/counters/${p.signalId}/offsets`),
  // No legacy rewrite covers this path, so the v5 URL must be used (it 404s otherwise).
  counterOffsetsCustom: (urls, p) => ({
    url: `${valueRoot(urls)}/counters/${p.signalId}/offsets/custom`,
    method: 'POST',
  }),
  counterOffsetsRemove: (urls, p) => ({
    url: `${valueRoot(urls)}/counters/${p.signalId}/offsets/remove`,
    method: 'POST',
  }),
  // Same missing-rewrite trap as `counterOffsetsCustom`.
  counterOffsetsCustomRemove: (urls, p) => ({
    url: `${valueRoot(urls)}/counters/${p.signalId}/offsets/custom/remove`,
    method: 'POST',
  }),
  statisticsReset: (urls, p) => ({
    url: `${valueRoot(urls)}/statistics/${p.signalId}/reset`,
    method: 'POST',
  }),
  // `/historicalvalueimport/import` -> the bare `historical-value-imports` collection root.
  historicalValueImport: (urls) => ({
    url: `${urls.historian}/historical-value-imports`,
    method: 'POST',
  }),

  // `/historicalvaluemanipulation/operations` -> `/historical-value-operations`.
  historicalValueOperations: (urls, p) => get(`${urls.historian}/historical-value-operations/${p.signalId}`),
  historicalValueOperationStart: (urls, p) => ({
    url: `${urls.historian}/historical-value-operations/${p.signalId}/start`,
    method: 'POST',
  }),
  // v5 accepts POST and PUT; POST is the non-legacy form.
  historicalValueOperationUndo: (urls, p) => ({
    url: `${urls.historian}/historical-value-operations/${p.operationId}/undo`,
    method: 'POST',
  }),
  historicalValueOperationRedo: (urls, p) => ({
    url: `${urls.historian}/historical-value-operations/${p.operationId}/redo`,
    method: 'POST',
  }),

  driverConfigureDataSource: (urls, p) => get(`${urls.driver}/command/source/${p.dataSourceId}/configure`),
  driverBrowseConnection: (urls, p) => ({
    url: `${urls.driver}/command/conn/${p.dataConnectionId}/browse`,
    method: 'POST',
  }),

  // Hub segment `hub` -> `values`. `Services.Live` has no `/v1` yet, so the URL still resolves
  // through the live service's catch-all rewrite; keep reading the path from config.
  liveHub: (urls) => ({ url: `${urls.live}/values`, method: 'HUB' }),
};
