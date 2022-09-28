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
import { firstValueFrom, isObservable } from 'rxjs';
import { PromiseUtils } from '../utils/promise-utils.js';
export class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        this.accessToken = accessToken;
        if (PromiseUtils.isPromise(accessToken)) {
            accessToken.then((token) => (this.accessToken = token));
        }
        else {
            this.accessToken = accessToken;
        }
    }
    getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = '';
            if (isObservable(this.accessToken)) {
                token = yield firstValueFrom(this.accessToken);
            }
            else if (PromiseUtils.isPromise(this.accessToken)) {
                token = yield this.accessToken;
            }
            else {
                token = this.accessToken;
            }
            return {
                Authorization: `Bearer ${this.accessToken}`,
            };
        });
    }
    getAccessTokenAsPromise() {
        if (isObservable(this.accessToken)) {
            return firstValueFrom(this.accessToken);
        }
        else if (PromiseUtils.isPromise(this.accessToken)) {
            return this.accessToken;
        }
        else {
            return Promise.resolve(this.accessToken);
        }
    }
    getStructureUrl() {
        return `${this.httpConfig.Services.BaseUri}${this.httpConfig.Services.Structure}`;
    }
    static requestHttpConfig(systemUrl) {
        return axios
            .get(`${systemUrl}/assets/conf/application.config`)
            .then((response) => response.data);
    }
}
