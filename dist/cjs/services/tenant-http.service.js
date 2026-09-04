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
exports.TenantHttpService = void 0;
const base_http_service_js_1 = require("./base-http.service.js");
class TenantHttpService extends base_http_service_js_1.BaseHttpService {
    getTenantViewById(id) {
        return this._get({ name: 'tenantViewById', tenantId: id });
    }
    getTenantViewForEntityId(entityId) {
        return this._get({ name: 'tenantViewForEntity', entityId: entityId });
    }
    getTopTenants() {
        return this._get({ name: 'tenantsTop' });
    }
    getNextTenants(tenantId) {
        return this._get({ name: 'tenantsNext', tenantId: tenantId });
    }
    filterTenantsByName(name) {
        return this._get({ name: 'tenantsFilter', filter: name });
    }
    /** All tenant endpoints are plain reads whose response shape is identical on v4 and v5. */
    _get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolved = yield this.resolve(endpoint);
            const response = yield this.ctx.http.request({ method: resolved.method, url: resolved.url });
            return response.data;
        });
    }
}
exports.TenantHttpService = TenantHttpService;
