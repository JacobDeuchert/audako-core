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
exports.UserProfileHttpService = void 0;
const axios_1 = __importDefault(require("axios"));
const base_http_service_js_1 = require("./base-http.service.js");
class UserProfileHttpService extends base_http_service_js_1.BaseHttpService {
    constructor(httpConfig, token) {
        super(httpConfig, token);
    }
    getUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeaders = yield this.getAuthorizationHeader();
                const userProfileResponse = yield axios_1.default.get(`${yield this.getStructureUrl()}/userprofile`, {
                    headers: authHeaders
                });
                if (userProfileResponse.status == 200) {
                    return userProfileResponse.data;
                }
            }
            catch (err) {
                throw new Error('Failed to request user profile with error: ' + (err === null || err === void 0 ? void 0 : err.message));
            }
        });
    }
}
exports.UserProfileHttpService = UserProfileHttpService;
