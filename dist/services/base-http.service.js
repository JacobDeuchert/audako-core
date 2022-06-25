"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpService = void 0;
const rxjs_1 = require("rxjs");
class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        if (accessToken instanceof rxjs_1.Observable) {
            accessToken.subscribe((token) => (this.accessToken = token));
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
}
exports.BaseHttpService = BaseHttpService;
