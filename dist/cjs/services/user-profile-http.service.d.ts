import { HttpConfig } from '../models/http-config.model.js';
import { UserProfile } from '../models/user-profile.model.js';
import { BaseHttpService } from './base-http.service.js';
import { AsyncValue } from '../utils/async-value-utils.js';
export declare class UserProfileHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, token: AsyncValue<string>);
    getUserProfile(): Promise<UserProfile>;
    updateUserProfile(profile: UserProfile): Promise<void>;
}
