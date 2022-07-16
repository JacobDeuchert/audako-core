import { HttpConfig } from '../models/http-config.model.js';
import { UserProfile } from '../models/user-profile.model.js';
import { BaseHttpService } from './base-http.service.js';
export declare class UserProfileHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, token: string);
    getUserProfile(): Promise<UserProfile>;
}
