var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { EntityHttpEndpoints, EntityType } from '../models/entities/configuration-entity.model.js';
import { BaseHttpService } from './base-http.service.js';
export class EntityHttpService extends BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    getEntityById(entityType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPartialEntityById(entityType, id, null);
        });
    }
    getPartialEntityById(entityType, id, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${yield this._createBaseUrlByType(entityType)}/${id}`;
            if (projection) {
                url += `?$projection=${JSON.stringify(projection)}`;
            }
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.get(url, { headers: headers });
            return response.data;
        });
    }
    queryConfiguration(entityType, query, paging, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(entityType)}/query`;
            const queryBody = {
                $filter: JSON.stringify(query),
                $paging: paging ? JSON.stringify(paging) : null,
                $projection: projection ? JSON.stringify(projection) : null,
            };
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.post(url, queryBody, { headers: headers });
            if (paging) {
                console.log(response.headers);
                const pagingResponseHeader = JSON.parse(response.headers['paging-headers']);
                const totalCount = Number(pagingResponseHeader.TotalCount);
                return {
                    data: response.data,
                    total: totalCount,
                };
            }
            return {
                data: response.data,
                total: response.data.length,
            };
        });
    }
    resolvePathName(idPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathGroups = yield this.queryConfiguration(EntityType.Group, { Id: { $in: idPath } });
            return idPath.map((id) => { var _a, _b; return (_b = (_a = pathGroups.data.find((x) => x.Id === id)) === null || _a === void 0 ? void 0 : _a.Name) !== null && _b !== void 0 ? _b : id; }).join('/');
        });
    }
    uploadProcessImage(id, svg, name = 'process-image.svg') {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(EntityType.ProcessImage)}/${id}/file/image`;
            const headers = yield this.getAuthorizationHeader();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const formData = new FormData();
            formData.append('file', blob, 'process-image.svg');
            yield axios.post(url, formData, { headers: headers });
        });
    }
    addEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this._createBaseUrlByType(type);
            const headers = yield this.getAuthorizationHeader();
            return axios.post(url, entity, { headers: headers }).then((response) => response.data);
        });
    }
    updateEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/${entity.Id}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.put(url, entity, { headers: headers }).then((response) => response.data);
        });
    }
    deleteEntity(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/${id}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.delete(url, { headers: headers }).then();
        });
    }
    copyTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/copy/${sourceEntityId}/to/${targetGroupId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.get(url, { headers }).then((response) => response.data);
        });
    }
    copyMultipleTo(sourceEntityIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/copy/multiple/${targetId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.put(url, sourceEntityIds, { responseType: 'text', headers: headers });
        });
    }
    moveTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/move/${sourceEntityId}/to/${targetGroupId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.get(url, { headers }).then((response) => response.data);
        });
    }
    moveMultipleTo(sourceIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/move/multiple/${targetId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios.put(url, sourceIds, { responseType: 'text', headers: headers });
        });
    }
    _createBaseUrlByType(entityType) {
        return __awaiter(this, void 0, void 0, function* () {
            return `${yield this.getStructureUrl()}${EntityHttpEndpoints[entityType]}`;
        });
    }
}
