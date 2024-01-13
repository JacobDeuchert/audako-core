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
import { getAsyncValueAsPromise } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export class HistoricalValue {
}
export class CounterOffset {
}
export class HistoricalValueObject {
}
export class HistoricalValueService extends BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    requestHistoricalValues(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            ;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.post(`${url}/value/manyflat`, requests, {
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
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios.post(url + '/value/many', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNearestValue(historicalValueRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios.post(url + '/value/nearest', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
        });
    }
    getNthHistoricalValue(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.getHistorianUrl();
            const authHeaders = yield this.getAuthorizationHeader();
            return axios.post(url + '/value/nth', request, {
                headers: authHeaders
            }).then(response => response.data);
        });
    }
    getHistorianUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield getAsyncValueAsPromise(this.httpConfig);
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Historian}`;
        });
    }
}
