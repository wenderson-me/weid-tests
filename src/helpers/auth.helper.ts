import { ENV } from '../config/env';

let cachedToken: string | null = null;

export async function login(): Promise<string> {
  if (cachedToken) return cachedToken;

  const res = await fetch(`${ENV.API_URL}auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ENV.USER_EMAIL, password: ENV.USER_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Login falhou: ${res.status} - ${await res.text()}`);
  }

  const setCookies = res.headers.getSetCookie();
  const accessTokenCookie = setCookies.find(c => c.startsWith('accessToken='));

  if (!accessTokenCookie) {
    throw new Error('Cookie accessToken não encontrado na resposta de login');
  }

  cachedToken = accessTokenCookie.split(';')[0].split('=').slice(1).join('=');
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
