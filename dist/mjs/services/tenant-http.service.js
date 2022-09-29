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
import { BaseHttpService } from './base-http.service.js';
export class TenantHttpService extends BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    getTenantViewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getStructureUrl()}/tenant/${id}/view`;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.get(url, { headers: headers });
            return response.data;
        });
    }
    getTopTenants() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getStructureUrl()}/tenant/top`;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.get(url, { headers: headers });
            return response.data;
        });
    }
    getNextTenants(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getStructureUrl()}/tenant/${tenantId}/next`;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.get(url, { headers: headers });
            return response.data;
        });
    }
}
