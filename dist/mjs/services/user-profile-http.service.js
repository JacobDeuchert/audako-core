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
export class UserProfileHttpService extends BaseHttpService {
    constructor(httpConfig, token) {
        super(httpConfig, token);
    }
    getUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfileResponse = yield axios.get(`${this.getStructureUrl()}/userprofile`, {
                    headers: this.getAuthorizationHeader()
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
