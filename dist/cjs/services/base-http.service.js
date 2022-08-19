"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const promise_utils_js_1 = require("../utils/promise-utils.js");
class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        if (promise_utils_js_1.PromiseUtils.isPromise(accessToken)) {
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
        return axios_1.default
            .get(`${systemUrl}/assets/conf/application.config`)
            .then((response) => response.data);
    }
}
exports.BaseHttpService = BaseHttpService;
