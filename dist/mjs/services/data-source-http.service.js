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
import { BaseHttpService } from './base-http.service';
export class DataSourceHttpService extends BaseHttpService {
    constructor(httpConfig, accessToken) {
        super(httpConfig, accessToken);
    }
    sendDatSrcConfiguration(dataSourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this._getDriverUrl()}/command/source/${dataSourceId}/configure`;
            const headers = yield this.getAuthorizationHeader();
            const response = yield axios.get(url, { headers: headers });
            return response.data;
        });
    }
    _getDriverUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield getAsyncValueAsPromise(this.httpConfig);
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Driver}`;
        });
    }
}
