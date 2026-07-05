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
exports.HistoricalValueManipulationHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const async_value_utils_js_1 = require("../utils/async-value-utils.js");
const base_http_service_js_1 = require("./base-http.service.js");
class HistoricalValueManipulationHttpService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    getHistoricalValueOperations(signalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = yield this.getBaseUrl();
            const headers = yield this.getAuthorizationHeader();
            const operations = yield axios_1.default
                .get(`${baseUrl}/operations/${signalId}`, { headers })
                .then((response) => response.data);
            return operations;
        });
    }
    startHistoricalValueOperation(signalId, from, till, timezone, operationScript, operationDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = yield this.getBaseUrl();
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default
                .post(`${baseUrl}/operations/${signalId}/start`, {
                From: from,
                Till: till,
                Timezone: timezone,
                OperationScript: operationScript,
                OperationDescription: operationDescription,
            }, { headers })
                .then((response) => response.data);
        });
    }
    undoHistoricalValueOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = yield this.getBaseUrl();
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.put(`${baseUrl}/operations/${operationId}/undo`, null, { headers }).then();
        });
    }
    redoHistoricalValueOperation(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = yield this.getBaseUrl();
            const headers = yield this.getAuthorizationHeader();
            return axios_1.default.put(`${baseUrl}/operations/${operationId}/redo`, null, { headers }).then();
        });
    }
    getBaseUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield (0, async_value_utils_js_1.getAsyncValueAsPromise)(this.httpConfig);
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Historian}/historicalvaluemanipulation`;
        });
    }
}
exports.HistoricalValueManipulationHttpService = HistoricalValueManipulationHttpService;
