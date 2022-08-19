import axios from 'axios';
import { PromiseUtils } from '../utils/promise-utils.js';
export class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        if (PromiseUtils.isPromise(accessToken)) {
            accessToken.then((token) => (this.accessToken = token));
        }
        else {
            this.accessToken = accessToken;
        }
    }
    getAuthorizationHeader() {
        return {
            Authorization: `Bearer ${this.accessToken}`,
        };
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
