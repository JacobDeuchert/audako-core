import { UserProfile } from '../models/user-profile.model.js';
import { BaseHttpService } from './base-http.service.js';
export declare class UserProfileHttpService extends BaseHttpService {
    /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
    getUserProfile(): Promise<UserProfile>;
    /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
    updateUserProfileSettings(settings: Record<string, string>): Promise<void>;
}
