import { EntityHttpEndpoints, EntityType } from '../../models/entities/configuration-entity.model.js';
function get(url) {
    return { url: url, method: 'GET' };
}
/** v4 entity collection root: `{structure}/{domain}/{Type}` from `EntityHttpEndpoints`. */
function entityRoot(urls, entityType) {
    return `${urls.structure}${EntityHttpEndpoints[entityType]}`;
}
/** Historian value group root. All v4 value endpoints hang under `/value`. */
function valueRoot(urls) {
    return `${urls.historian}/value`;
}
/** v4 endpoint table (platform 4.12 - 4.23). See docs/analysis/v4-to-v5-endpoints.md. */
export const V4_ENDPOINTS = {
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
        url: `${entityRoot(urls, EntityType.ProcessImage)}/${p.id}/file/image`,
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
