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
exports.TenantHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const base_http_service_js_1 = require("./base-http.service.js");
class TenantHttpService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    getTenantViewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.getStructureUrl()}/tenant/${id}/view`;
            const headers = this.getAuthorizationHeader();
            const response = yield axios_1.default.get(url, { headers: headers });
            return response.data;
        });
    }
    getTopTenants() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.getStructureUrl()}/tenant/top`;
            const headers = this.getAuthorizationHeader();
            const response = yield axios_1.default.get(url, { headers: headers });
            return response.data;
        });
    }
    getNextTenants(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.getStructureUrl()}/tenant/${tenantId}/next`;
            const headers = this.getAuthorizationHeader();
            const response = yield axios_1.default.get(url, { headers: headers });
            return response.data;
        });
    }
}
exports.TenantHttpService = TenantHttpService;
