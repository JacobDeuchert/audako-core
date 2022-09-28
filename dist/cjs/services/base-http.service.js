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
const rxjs_1 = require("rxjs");
const promise_utils_js_1 = require("../utils/promise-utils.js");
class BaseHttpService {
    constructor(httpConfig, accessToken) {
        this.httpConfig = httpConfig;
        this.accessToken = accessToken;
        if (promise_utils_js_1.PromiseUtils.isPromise(accessToken)) {
            accessToken.then((token) => (this.accessToken = token));
        }
        else {
            this.accessToken = accessToken;
        }
    }
    getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = '';
            if ((0, rxjs_1.isObservable)(this.accessToken)) {
                token = yield (0, rxjs_1.firstValueFrom)(this.accessToken);
            }
            else if (promise_utils_js_1.PromiseUtils.isPromise(this.accessToken)) {
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
        if ((0, rxjs_1.isObservable)(this.accessToken)) {
            return (0, rxjs_1.firstValueFrom)(this.accessToken);
        }
        else if (promise_utils_js_1.PromiseUtils.isPromise(this.accessToken)) {
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
        return axios_1.default
            .get(`${systemUrl}/assets/conf/application.config`)
            .then((response) => response.data);
    }
}
exports.BaseHttpService = BaseHttpService;
