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
            const url = `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}/value/manyflat`;
            const response = yield axios.post(url, requests, {
                headers: this.getAuthorizationHeader()
            });
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.data;
        });
    }
    getHistoricalValueObjects(historicalValueRequest) {
        const url = this.getUrl();
        const authHeaders = this.getAuthorizationHeader();
        return axios.post(url + '/value/many', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
    }
    getNearestValue(historicalValueRequest) {
        const url = this.getUrl();
        const authHeaders = this.getAuthorizationHeader();
        return axios.post(url + '/value/nearest', historicalValueRequest, { headers: authHeaders }).then(response => response.data);
    }
    getNthHistoricalValue(request) {
        const url = this.getUrl();
        const authHeaders = this.getAuthorizationHeader();
        return axios.post(url + '/value/nth', request, {
            headers: authHeaders
        }).then(response => response.data);
    }
    getUrl() {
        return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Historian}`;
    }
}
