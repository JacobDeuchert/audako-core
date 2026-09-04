import { describe, expect, it } from 'vitest';
import { UserProfileHttpService } from '../../lib/services/user-profile-http.service.js';
import { stubContext } from './api-context-stub.js';

function service(platformVersion: string) {
  const stub = stubContext(platformVersion);
  stub.request.mockResolvedValue({ data: { Settings: {} }, headers: {} });
  return { service: new UserProfileHttpService(stub.ctx), request: stub.request };
}

describe('UserProfileHttpService URL resolution', () => {
  it('uses /userprofile on v4', async () => {
    const { service: svc, request } = service('4.23.0');

    await svc.getUserProfile();
    await svc.updateUserProfileSettings({ theme: 'dark' });

    expect(request.mock.calls[0][0]).toMatchObject({ method: 'GET', url: 'https://host/api/structure/userprofile' });
    expect(request.mock.calls[1][0]).toMatchObject({
      method: 'PUT',
      url: 'https://host/api/structure/userprofile',
      data: { theme: 'dark' },
    });
  });

  it('uses /user-profile on v5', async () => {
    const { service: svc, request } = service('5.0.0');

    await svc.getUserProfile();
    await svc.updateUserProfileSettings({ theme: 'dark' });

    expect(request.mock.calls[0][0].url).toBe('https://host/api/v1/structure/user-profile');
    expect(request.mock.calls[1][0].url).toBe('https://host/api/v1/structure/user-profile');
  });
});
