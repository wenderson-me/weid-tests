import { APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env';

let cachedToken: string | null = null;

export async function login(request: APIRequestContext): Promise<string> {
  if (cachedToken) return cachedToken;

  const response = await request.post('auth/login', {
    data: {
      email: ENV.USER_EMAIL,
      password: ENV.USER_PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login falhou: ${response.status()} - ${await response.text()}`);
  }

  const setCookies = response.headersArray().filter(h => h.name.toLowerCase() === 'set-cookie');
  const accessTokenCookie = setCookies.find(c => c.value.startsWith('accessToken='));

  if (!accessTokenCookie) {
    throw new Error('Cookie accessToken não encontrado na resposta de login');
  }

  cachedToken = accessTokenCookie.value.split(';')[0].split('=').slice(1).join('=');
  return cachedToken;
}

export function getAuthHeaders(accessToken: string) {
  return {
    Cookie: `accessToken=${accessToken}`,
  };
}

export function clearTokenCache() {
  cachedToken = null;
}
