import { UserProfile } from '../models/user-profile.model.js';
import { BaseHttpService } from './base-http.service.js';

export class UserProfileHttpService extends BaseHttpService {
  /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
  public async getUserProfile(): Promise<UserProfile> {
    try {
      const endpoint = await this.resolve({ name: 'userProfile' });
      const response = await this.ctx.http.request<UserProfile>({ method: endpoint.method, url: endpoint.url });
      return response.data;
    } catch (err) {
      throw new Error('Failed to request user profile with error: ' + err?.message);
    }
  }

  /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
  public async updateUserProfileSettings(settings: Record<string, string>): Promise<void> {
    try {
      const endpoint = await this.resolve({ name: 'userProfile' });
      await this.ctx.http.request({ method: 'PUT', url: endpoint.url, data: settings });
    } catch (err) {
      throw new Error('Failed to update user profile with error: ' + err?.message);
    }
  }
}
