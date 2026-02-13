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
exports.BaseHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const async_value_utils_js_1 = require("../utils/async-value-utils.js");
class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        this.accessToken = accessToken;
    }
    getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield (0, async_value_utils_js_1.getAsyncValueAsPromise)(this.accessToken);
            return {
                Authorization: `Bearer ${token}`,
            };
        });
    }
    getAccessToken() {
        return (0, async_value_utils_js_1.getAsyncValueAsPromise)(this.accessToken);
    }
    getStructureUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const httpConfig = yield (0, async_value_utils_js_1.getAsyncValueAsPromise)(this.httpConfig);
            return `${httpConfig.Services.BaseUri}${httpConfig.Services.Structure}`;
        });
    }
    static requestHttpConfig(systemUrl) {
        return axios_1.default
            .get(`${systemUrl}/assets/conf/application.config`)
            .then((response) => response.data);
    }
    static isApiReachable(apiUrl) {
        return axios_1.default
            .get(`${apiUrl}/api/structure/about/version`)
            .then((response) => response.status === 200 || response.status === 401)
            .catch((error) => { var _a; return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401; });
    }
}
exports.BaseHttpService = BaseHttpService;
