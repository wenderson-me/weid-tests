import { test, expect } from '@playwright/test';
import { ENV } from '../../src/config/env';

test.describe('Auth API', () => {
  test.describe('POST /auth/login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const res = await fetch(`${ENV.API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ENV.USER_EMAIL, password: ENV.USER_PASSWORD }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toBe('Login realizado com sucesso');
      expect(body.data.user).toHaveProperty('id');
      expect(body.data.user.email).toBe(ENV.USER_EMAIL);
      expect(body.data.user).toHaveProperty('name');
      expect(body.data.user).toHaveProperty('role');
      expect(body.data.user).toHaveProperty('avatar');

      const setCookies = res.headers.getSetCookie();
      const hasAccessToken = setCookies.some(c => c.startsWith('accessToken='));
      const hasRefreshToken = setCookies.some(c => c.startsWith('refreshToken='));
      expect(hasAccessToken).toBe(true);
      expect(hasRefreshToken).toBe(true);
    });

    test('deve rejeitar login com senha incorreta', async () => {
      const res = await fetch(`${ENV.API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ENV.USER_EMAIL, password: 'SenhaErrada@123' }),
      });

      expect([401, 429]).toContain(res.status);
    });

    test('deve rejeitar login com email inexistente', async () => {
      const res = await fetch(`${ENV.API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'inexistente@nowhere.com', password: 'Qualquer@123' }),
      });

      expect([401, 404, 429]).toContain(res.status);
    });

    test('deve rejeitar login sem campos obrigatórios', async () => {
      const res = await fetch(`${ENV.API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect([400, 429]).toContain(res.status);
    });
  });
});
