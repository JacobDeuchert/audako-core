"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHttpService = void 0;
const errors_js_1 = require("../api/errors.js");
// Imported through the adapter entry point so the v4 adapters register themselves.
const index_js_1 = require("../compat/adapters/index.js");
const base_http_service_js_1 = require("./base-http.service.js");
/** Appends `key=value` to a URL, keeping the existing query string intact. */
function withQueryParam(url, key, value) {
    return `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`;
}
class EntityHttpService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfigOrCtx, accessToken) {
        super(httpConfigOrCtx, accessToken);
    }
    getEntityById(entityType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPartialEntityById(entityType, id, null);
        });
    }
    /**
     * `GET {entity}/{id}`, optionally projected. `$projection` is a query string parameter on both
     * versions; projection keys are canonical field names and are never rewritten (plan decision 7).
     */
    getPartialEntityById(entityType, id, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityById', entityType: entityType, id: id });
            const url = projection ? withQueryParam(endpoint.url, '$projection', JSON.stringify(projection)) : endpoint.url;
            const response = yield this._request({ method: endpoint.method, url: url });
            return this._fromWire(entityType, response.data, yield this.getVersionInfo());
        });
    }
    /**
     * Queries a collection.
     *
     * - v4: `POST {entity}/query` with `{$filter, $paging, $projection}` in the body.
     * - v5: the `QUERY` verb on the collection root with `{$filter, $paging, $sort}` in the body and
     *   `$projection` in the query string.
     *
     * The `QUERY` verb is open item 1 of docs/v4-v5-compatibility-plan.md: it works with axios in
     * Node, but browser XHR/fetch support has not been verified end to end through the proxy. There
     * is deliberately no POST fallback here - `POST {entity}/query` answers 405 on v5, so a fallback
     * could only be provided platform-side.
     */
    queryConfiguration(entityType, query, paging, projection, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const versionInfo = yield this.getVersionInfo();
            const endpoint = yield this.resolve({ name: 'entityQuery', entityType: entityType });
            const filter = JSON.stringify(query);
            const pagingValue = paging ? JSON.stringify(paging) : null;
            const projectionValue = projection ? JSON.stringify(projection) : null;
            const sortValue = (options === null || options === void 0 ? void 0 : options.sort) ? JSON.stringify(options.sort) : null;
            let url = endpoint.url;
            let body;
            const headers = {};
            if (versionInfo.supports('queryVerb')) {
                body = { $filter: filter, $paging: pagingValue, $sort: sortValue };
                if (projectionValue) {
                    url = withQueryParam(url, '$projection', projectionValue);
                }
                if (options === null || options === void 0 ? void 0 : options.language) {
                    headers['Language'] = options.language;
                }
            }
            else {
                // v4 has neither $sort nor the Language header; both are dropped.
                body = { $filter: filter, $paging: pagingValue, $projection: projectionValue };
            }
            const response = yield this._request({
                method: endpoint.method,
                url: url,
                data: body,
                headers: headers,
            });
            const data = (response.data || []).map((item) => this._fromWire(entityType, item, versionInfo));
            // `Paging-Headers: {"TotalCount":N}` is unchanged in v5 and only sent when $paging was.
            const pagingHeader = paging ? (_a = response.headers) === null || _a === void 0 ? void 0 : _a['paging-headers'] : null;
            if (pagingHeader) {
                return {
                    data: data,
                    total: Number(JSON.parse(pagingHeader).TotalCount),
                };
            }
            return {
                data: data,
                total: data.length,
            };
        });
    }
    uploadProcessImage(id, svg, name = 'process-image.svg') {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'processImageUpload', id: id });
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const formData = new FormData();
            formData.append('file', blob, name);
            yield this._request({ method: endpoint.method, url: endpoint.url, data: formData });
        });
    }
    addEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const versionInfo = yield this.getVersionInfo();
            const endpoint = yield this.resolve({ name: 'entityCollection', entityType: type });
            const payload = this._toWire(type, entity, versionInfo);
            const response = yield this._request({ method: endpoint.method, url: endpoint.url, data: payload });
            return this._fromWire(type, response.data, versionInfo);
        });
    }
    /**
     * `PUT {entity}/{id}`.
     *
     * The caller's instance is never modified; everything happens on the wire copy. On v4 the copy
     * loses `CreatedBy`/`CreatedOn` (the platform answers 400 when they are present); on v5 both are
     * kept (the platform restores them anyway) and `ChangedOn` is round-tripped, because it is the
     * optimistic-concurrency token there (feature `optimisticConcurrency`).
     *
     * @throws EntityLockedError on 423, when the entity is in a locked subtree (v5).
     * @throws ApiError on 400, e.g. when `entity.Id` does not match the route id (v5).
     */
    updateEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const versionInfo = yield this.getVersionInfo();
            const endpoint = yield this.resolve({ name: 'entityById', entityType: type, id: entity.Id });
            const payload = this._toWire(type, entity, versionInfo);
            const response = yield this._request({ method: 'PUT', url: endpoint.url, data: payload });
            return this._fromWire(type, response.data, versionInfo);
        });
    }
    /** `DELETE {entity}/{id}`. 204 on both versions. */
    deleteEntity(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityById', entityType: type, id: id });
            yield this._request({ method: 'DELETE', url: endpoint.url });
        });
    }
    copyTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({
                name: 'entityCopy',
                entityType: type,
                sourceId: sourceEntityId,
                targetId: targetGroupId,
            });
            const response = yield this._request({ method: endpoint.method, url: endpoint.url });
            return this._fromWire(type, response.data, yield this.getVersionInfo());
        });
    }
    /**
     * Starts a bulk copy and returns the operation id. v4 answers with the bare id as text, v5 with
     * `{"OperationId":"..."}`; both are normalized to the id string.
     */
    copyMultipleTo(sourceEntityIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityCopyMultiple', entityType: type, targetId: targetId });
            const response = yield this._request({ method: endpoint.method, url: endpoint.url, data: sourceEntityIds });
            return this._readOperationId(response.data);
        });
    }
    moveTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({
                name: 'entityMove',
                entityType: type,
                sourceId: sourceEntityId,
                targetId: targetGroupId,
            });
            const response = yield this._request({ method: endpoint.method, url: endpoint.url });
            return this._fromWire(type, response.data, yield this.getVersionInfo());
        });
    }
    /** Starts a bulk move and returns the operation id. See {@link copyMultipleTo}. */
    moveMultipleTo(sourceIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityMoveMultiple', entityType: type, targetId: targetId });
            const response = yield this._request({ method: endpoint.method, url: endpoint.url, data: sourceIds });
            return this._readOperationId(response.data);
        });
    }
    /**
     * `GET {entity}/count?$filter=` - number of entities matching the filter.
     *
     * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityCount')`; on v4 this
     * throws {@link UnsupportedApiVersionError} because the endpoint does not exist.
     */
    countEntities(entityType, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityCount', entityType: entityType });
            const url = filter ? withQueryParam(endpoint.url, '$filter', JSON.stringify(filter)) : endpoint.url;
            const response = yield this._request({ method: endpoint.method, url: url });
            return Number(response.data);
        });
    }
    /**
     * `GET {entity}/entity-info?$filter=&$sort=&$paging=` - `{Id, Name, Description, Type, GroupId,
     * Path}` for a whole filtered set in one request, replacing per-id lookups.
     *
     * v5 only. Gate calls with `(await service.getVersionInfo()).supports('entityInfo')`; on v4 this
     * throws {@link UnsupportedApiVersionError}.
     */
    getEntityInfos(entityType, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = yield this.resolve({ name: 'entityInfo', entityType: entityType });
            let url = endpoint.url;
            if (options === null || options === void 0 ? void 0 : options.filter) {
                url = withQueryParam(url, '$filter', JSON.stringify(options.filter));
            }
            if (options === null || options === void 0 ? void 0 : options.sort) {
                url = withQueryParam(url, '$sort', JSON.stringify(options.sort));
            }
            if (options === null || options === void 0 ? void 0 : options.paging) {
                url = withQueryParam(url, '$paging', JSON.stringify(options.paging));
            }
            const headers = {};
            if (options === null || options === void 0 ? void 0 : options.language) {
                headers['Language'] = options.language;
            }
            const response = yield this._request({ method: endpoint.method, url: url, headers: headers });
            return response.data || [];
        });
    }
    /**
     * Slim entity descriptors for a set of ids, in one request.
     *
     * Assumption: `$filter` accepts the store's `{ Id: { $in: [...] } }` operator form, as the
     * analysis doc documents no filter grammar for `entity-info`.
     */
    getEntityInfosByIds(entityType, ids, language) {
        return this.getEntityInfos(entityType, { filter: { Id: { $in: ids } }, language: language });
    }
    /** Runs a request on the context's axios instance and normalizes failures to `ApiError`. */
    _request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ctx.http.request({
                    method: config.method,
                    url: config.url,
                    data: config.data,
                    headers: config.headers,
                });
            }
            catch (error) {
                throw (0, errors_js_1.parseApiError)(error);
            }
        });
    }
    /** Wire -> canonical model, through the entity's adapter. */
    _fromWire(entityType, wire, versionInfo) {
        return index_js_1.entityAdapters.applyFromWire(entityType, wire, versionInfo);
    }
    /**
     * Canonical model -> wire payload. Always returns a copy: `applyToWire` strips the server-owned
     * `Path`/`AclAllow`/`AclDeny` on a shallow clone, so the caller's instance stays untouched.
     */
    _toWire(type, entity, versionInfo) {
        const payload = index_js_1.entityAdapters.applyToWire(type, entity, versionInfo);
        if (!versionInfo.supports('optimisticConcurrency')) {
            // v4 answers 400 when CreatedBy/CreatedOn are present. v5 restores them server-side and
            // uses ChangedOn as an optimistic-concurrency token, so everything is round-tripped there.
            delete payload.CreatedBy;
            delete payload.CreatedOn;
        }
        return payload;
    }
    /** `{"OperationId":"..."}` (v5), a JSON string of it, or the bare id as text (v4). */
    _readOperationId(data) {
        if (data && typeof data === 'object') {
            return data.OperationId;
        }
        if (typeof data === 'string') {
            const value = data.trim();
            if (value.startsWith('{')) {
                try {
                    return JSON.parse(value).OperationId;
                }
                catch (_a) {
                    return value;
                }
            }
            return value;
        }
        return data;
    }
}
exports.EntityHttpService = EntityHttpService;
