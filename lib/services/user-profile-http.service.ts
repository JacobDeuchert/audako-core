import axios from 'axios';
import { HttpConfig } from '../models/http-config.model.js';
import { UserProfile } from '../models/user-profile.model.js';
import { BaseHttpService } from './base-http.service.js';

export class UserProfileHttpService extends BaseHttpService {

  constructor(httpConfig: HttpConfig, token: string | Promise<string>) {
    super(httpConfig, token);
  }
  public async getUserProfile(): Promise<UserProfile> {
    try {
      const userProfileResponse = await axios.get<UserProfile>(
        `${this.getStructureUrl()}/userprofile`,
        {
          headers: this.getAuthorizationHeader()
        }
      );

      if (userProfileResponse.status == 200) {
        return userProfileResponse.data;
      }
    } catch (err) {
      throw new Error('Failed to request user profile with error: ' + err?.message);
    }
  }
}
