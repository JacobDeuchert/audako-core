import { ApiContext } from '../api/api-context.js';
import { UserProfile } from '../models/user-profile.model.js';

const CUSTOM_COLORS_SETTING = 'CustomColors';
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

/** Failures surface as `ApiError` with the platform's status and error code intact. */
export class UserProfileHttpService {
  constructor(public readonly ctx: ApiContext) {}

  /** `GET {structure}/userprofile` (v4) / `GET {structure}/user-profile` (v5). Same response. */
  public async getUserProfile(): Promise<UserProfile> {
    const response = await this.ctx.request<UserProfile>({ name: 'userProfile' }, { method: 'GET' });
    return response.data;
  }

  /**
   * The color picker's custom colors as `#rrggbb` strings, in stored order. v4 always stores ten
   * slots and pads unused ones with `#ffffff`, so those come back as white; v5 stores only the
   * colors the user added. A missing or unreadable setting yields `[]`.
   */
  public async getCustomColors(): Promise<string[]> {
    const profile = await this.getUserProfile();
    return parseCustomColors(profile.UserSettings?.[CUSTOM_COLORS_SETTING]);
  }

  /** `PUT` of the settings dictionary. Answers 200 with an empty body on both versions. */
  public async updateUserProfileSettings(settings: Record<string, string>): Promise<void> {
    await this.ctx.request({ name: 'userProfile' }, { method: 'PUT', data: settings });
  }
}

function parseCustomColors(setting: string | undefined): string[] {
  if (!setting) {
    return [];
  }

  let stored: unknown;
  try {
    stored = JSON.parse(setting);
  } catch {
    return [];
  }

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored.filter((color: unknown): color is string => typeof color === 'string' && HEX_COLOR_PATTERN.test(color));
}
