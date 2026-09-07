import { ApiContext } from '../api/api-context.js';
import { UserProfile } from '../models/user-profile.model.js';

/** Failures surface as `ApiError` with the platform's status and error code intact. */
export class UserProfileHttpService {
  constructor(public readonly ctx: ApiContext) {}

  /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
  public async getUserProfile(): Promise<UserProfile> {
    const response = await this.ctx.request<UserProfile>({ name: 'userProfile' }, { method: 'GET' });
    return response.data;
  }

  /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
  public async updateUserProfileSettings(settings: Record<string, string>): Promise<void> {
    await this.ctx.request({ name: 'userProfile' }, { method: 'PUT', data: settings });
  }
}
