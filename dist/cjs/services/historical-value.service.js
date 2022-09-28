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
exports.HistoricalValueService = exports.HistoricalValueObject = exports.CounterOffset = exports.HistoricalValue = void 0;
const axios_1 = __importDefault(require("axios"));
const base_http_service_js_1 = require("./base-http.service.js");
class HistoricalValue {
}
exports.HistoricalValue = HistoricalValue;
class CounterOffset {
}
exports.CounterOffset = CounterOffset;
class HistoricalValueObject {
}
exports.HistoricalValueObject = HistoricalValueObject;
class HistoricalValueService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    requestHistoricalValues(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}/value/manyflat`;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios_1.default.post(url, requests, {
                headers: headers
            });
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.data;
        });
    }
    getHistoricalValueObjects(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/many', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNearestValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/nearest', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNthHistoricalValue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/nth', request, {
                headers: authHeaders
            }).then(response => response.data);
        });
    }
    getUrl() {
        return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}`;
    }
}
exports.HistoricalValueService = HistoricalValueService;
