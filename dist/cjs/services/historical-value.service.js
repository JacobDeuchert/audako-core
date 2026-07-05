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
exports.HistoricalValueService = exports.HistoricalValueObject = exports.CounterOffset = exports.OffsetSource = exports.HistoricalValue = void 0;
const axios_1 = __importDefault(require("axios"));
const async_value_utils_js_1 = require("../utils/async-value-utils.js");
const base_http_service_js_1 = require("./base-http.service.js");
class HistoricalValue {
    static getSignalValues(historicalValuePackage) {
        const signalValues = [];
        Object.keys(historicalValuePackage).forEach((key) => {
            if (key !== 'IntervalStart' && key !== 'Manual' && key !== 'Note' && key !== 'Value') {
                signalValues.push({ id: key, value: historicalValuePackage[key] });
            }
        });
        return signalValues;
    }
}
exports.HistoricalValue = HistoricalValue;
var OffsetSource;
(function (OffsetSource) {
    OffsetSource["Manual"] = "Manual";
    OffsetSource["CounterReplacement"] = "CounterReplacement";
    OffsetSource["CounterReadingAlignment"] = "CounterReadingAlignment";
})(OffsetSource || (exports.OffsetSource = OffsetSource = {}));
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
            const url = yield this.getHistorianUrl();
            ;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios_1.default.post(`${url}/value/manyflat`, requests, {
                headers: headers
            });
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.data;
        });
    }
    getHistoricalValues(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/manyflat', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getHistoricalValueObjects(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/many', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNearestValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/nearest', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNearesValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getNearestValue(historicalValueRequest);
        });
    }
    getNthHistoricalValue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/nth', request, {
                headers: authHeaders
            }).then(response => response.data);
        });
    }
    postManualData(manualDataRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/manual', manualDataRequests, { headers: authHeaders }).then();
        });
    }
    postNoteEntries(noteEntryRequests) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url + '/value/note', noteEntryRequests, { headers: authHeaders }).then();
        });
    }
    getCounterOffsets(id, from, till) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${yield this.getHistorianUrl()}/value/counter/${id}/offsets?`;
            if (from) {
                url += `&$from=${from.toISOString()}`;
            }
            if (till) {
                url += `&$till=${till.toISOString()}`;
            }
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.get(url, { headers: authHeaders }).then(response => Object.keys(response.data).map((key) => ({
                Date: key,
                Value: response.data[key].Effective,
                Calculated: response.data[key].Calculated,
                Custom: response.data[key].Custom,
            })));
        });
    }
    setCustomOffset(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getHistorianUrl()}/value/counter/${id}/offsets/custom`;
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, request, { headers: authHeaders }).then();
        });
    }
    deleteCounterOffsets(id, timestamps) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getHistorianUrl()}/value/counter/${id}/offsets/remove`;
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, timestamps, { headers: authHeaders }).then();
        });
    }
    deleteCustomOffsets(id, timestamps) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getHistorianUrl()}/value/counter/${id}/offsets/custom/remove`;
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, timestamps, { headers: authHeaders }).then(response => response.data);
        });
    }
    resetCalculatedValuesAndStatistic(signalId, resetOffsets, from = null, till = null, resetCustomOffsets = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getHistorianUrl()}/value/statistics/${signalId}/reset`;
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, {
                From: from ? from.toISOString() : null,
                Till: till ? till.toISOString() : null,
                ResetOffsets: resetOffsets,
                ResetCustomOffsets: resetCustomOffsets,
            }, { headers: authHeaders }).then(response => response.data);
        });
    }
    importHistoricalValues(importData) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${yield this.getHistorianUrl()}/historicalvalueimport/import`;
            const authHeaders = yield this.getAuthorizationHeader();
            return axios_1.default.post(url, { Values: importData }, { headers: authHeaders }).then(response => response.data);
        });
    }
    getHistorianUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield (0, async_value_utils_js_1.getAsyncValueAsPromise)(this.httpConfig);
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Historian}`;
        });
    }
}
exports.HistoricalValueService = HistoricalValueService;
