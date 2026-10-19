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

describe('UserProfileHttpService errors', () => {
  it('keeps the status and error code of a failed request', async () => {
    const stub = stubContext('5.0.0');
    stub.request.mockRejectedValue({
      response: { status: 401, data: { title: 'Auth.Unauthorized', detail: 'token expired' } },
    });
    const svc = new UserProfileHttpService(stub.ctx);

    await expect(svc.getUserProfile()).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      title: 'Auth.Unauthorized',
    });
  });
});

describe('UserProfileHttpService.getCustomColors', () => {
  function withSettings(platformVersion: string, settings: Record<string, string>) {
    const stub = stubContext(platformVersion);
    stub.request.mockResolvedValue({ data: { UserSettings: settings }, headers: {} });
    return new UserProfileHttpService(stub.ctx);
  }

  it('returns the ten v4 slots including the white padding', async () => {
    const stored = ['#ff0000', ...Array(9).fill('#ffffff')];
    const svc = withSettings('4.23.0', { CustomColors: JSON.stringify(stored) });

    await expect(svc.getCustomColors()).resolves.toEqual(stored);
  });

  it('returns the colors the user added on v5', async () => {
    const svc = withSettings('5.0.0', { CustomColors: JSON.stringify(['#4c6a42', '#00AAFF']) });

    await expect(svc.getCustomColors()).resolves.toEqual(['#4c6a42', '#00AAFF']);
  });

  it('drops entries that are not #rrggbb colors', async () => {
    const svc = withSettings('5.0.0', { CustomColors: JSON.stringify(['#123456', 'red', 42, null, '#fff']) });

    await expect(svc.getCustomColors()).resolves.toEqual(['#123456']);
  });

  it.each([
    ['missing', {}],
    ['empty', { CustomColors: '' }],
    ['not JSON', { CustomColors: '#ff0000' }],
    ['not an array', { CustomColors: '{"a":"#ff0000"}' }],
  ])('returns [] when the setting is %s', async (_case: string, settings: Record<string, string>) => {
    const svc = withSettings('5.0.0', settings);

    await expect(svc.getCustomColors()).resolves.toEqual([]);
  });
});
