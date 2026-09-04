var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseHttpService } from './base-http.service.js';
export class UserProfileHttpService extends BaseHttpService {
    constructor(httpConfigOrCtx, accessToken) {
        super(httpConfigOrCtx, accessToken);
    }
    /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
    getUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const endpoint = yield this.resolve({ name: 'userProfile' });
                const response = yield this.ctx.http.request({ method: endpoint.method, url: endpoint.url });
                return response.data;
            }
            catch (err) {
                throw new Error('Failed to request user profile with error: ' + (err === null || err === void 0 ? void 0 : err.message));
            }
        });
    }
    /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
    updateUserProfileSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const endpoint = yield this.resolve({ name: 'userProfile' });
                yield this.ctx.http.request({ method: 'PUT', url: endpoint.url, data: settings });
            }
            catch (err) {
                throw new Error('Failed to update user profile with error: ' + (err === null || err === void 0 ? void 0 : err.message));
            }
        });
    }
}
