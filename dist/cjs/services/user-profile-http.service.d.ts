import { HttpConfig } from '../models/http-config.model';
import { UserProfile } from '../models/user-profile.model';
import { BaseHttpService } from './base-http.service';
export declare class UserProfileHttpService extends BaseHttpService {
    constructor(httpConfig: HttpConfig, token: string);
    getUserProfile(): Promise<UserProfile>;
}
