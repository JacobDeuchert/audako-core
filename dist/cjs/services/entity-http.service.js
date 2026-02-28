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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const configuration_entity_model_js_1 = require("../models/entities/configuration-entity.model.js");
const base_http_service_js_1 = require("./base-http.service.js");
class EntityHttpService extends base_http_service_js_1.BaseHttpService {
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
            const response = yield axios_1.default.get(url, { headers: headers });
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
            const response = yield axios_1.default.post(url, queryBody, { headers: headers });
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
    uploadProcessImage(id, svg, name = 'process-image.svg') {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(configuration_entity_model_js_1.EntityType.ProcessImage)}/${id}/file/image`;
            const headers = yield this.getAuthorizationHeader();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const formData = new FormData();
            formData.append('file', blob, 'process-image.svg');
            yield axios_1.default.post(url, formData, { headers: headers });
        });
    }
    addEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this._createBaseUrlByType(type);
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, entity, { headers: headers }).then((response) => response.data);
        });
    }
    updateEntity(type, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/${entity.Id}`;
            // need to remove these properties as backend throws 400 if they are present
            delete entity.ChangedBy;
            delete entity.ChangedOn;
            delete entity.CreatedBy;
            delete entity.CreatedOn;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.put(url, entity, { headers: headers }).then((response) => response.data);
        });
    }
    deleteEntity(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/${id}`;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.delete(url, { headers: headers }).then();
        });
    }
    copyTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/copy/${sourceEntityId}/to/${targetGroupId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.get(url, { headers }).then((response) => response.data);
        });
    }
    copyMultipleTo(sourceEntityIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/copy/multiple/${targetId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.put(url, sourceEntityIds, { responseType: 'text', headers: headers });
        });
    }
    moveTo(sourceEntityId, targetGroupId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/move/${sourceEntityId}/to/${targetGroupId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.get(url, { headers }).then((response) => response.data);
        });
    }
    moveMultipleTo(sourceIds, targetId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this._createBaseUrlByType(type)}/move/multiple/${targetId}`;
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.put(url, sourceIds, { responseType: 'text', headers: headers });
        });
    }
    _createBaseUrlByType(entityType) {
        return __awaiter(this, void 0, void 0, function* () {
            return `${yield this.getStructureUrl()}${configuration_entity_model_js_1.EntityHttpEndpoints[entityType]}`;
        });
    }
}
exports.EntityHttpService = EntityHttpService;
