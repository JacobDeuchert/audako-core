import { ApiContext } from '../api/api-context.js';
import { HttpConfig } from '../models/http-config.model.js';
import { UserProfile } from '../models/user-profile.model.js';
import { AsyncValue } from '../utils/async-value-utils.js';
import { BaseHttpService } from './base-http.service.js';
export declare class UserProfileHttpService extends BaseHttpService {
    /**
     * @param ctx Context of the target system.
     */
    constructor(ctx: ApiContext);
    /**
     * @deprecated Pass an `ApiContext` instead.
     */
    constructor(httpConfig: AsyncValue<HttpConfig>, accessToken: AsyncValue<string>);
    /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
    getUserProfile(): Promise<UserProfile>;
    /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
    updateUserProfileSettings(settings: Record<string, string>): Promise<void>;
}
