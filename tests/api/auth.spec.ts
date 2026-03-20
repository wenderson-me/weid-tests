import { test, expect } from '@playwright/test';
import { ENV } from '../../src/config/env';

test.describe('Auth API', () => {
  test.describe('POST /auth/login', () => {
    test('deve fazer login com credenciais válidas', async ({ request }) => {
      const response = await request.post('auth/login', {
        data: {
          email: ENV.USER_EMAIL,
          password: ENV.USER_PASSWORD,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.message).toBe('Login realizado com sucesso');
      expect(body.data.user).toHaveProperty('id');
      expect(body.data.user.email).toBe(ENV.USER_EMAIL);
      expect(body.data.user).toHaveProperty('name');
      expect(body.data.user).toHaveProperty('role');
      expect(body.data.user).toHaveProperty('avatar');

      const setCookies = response.headersArray().filter(h => h.name.toLowerCase() === 'set-cookie');
      const hasAccessToken = setCookies.some(c => c.value.startsWith('accessToken='));
      const hasRefreshToken = setCookies.some(c => c.value.startsWith('refreshToken='));
      expect(hasAccessToken).toBe(true);
      expect(hasRefreshToken).toBe(true);
    });

    test('deve rejeitar login com senha incorreta', async ({ request }) => {
      const response = await request.post('auth/login', {
        data: {
          email: ENV.USER_EMAIL,
          password: 'SenhaErrada@123',
        },
      });

      expect([401, 429]).toContain(response.status());
    });

    test('deve rejeitar login com email inexistente', async ({ request }) => {
      const response = await request.post('auth/login', {
        data: {
          email: 'inexistente@nowhere.com',
          password: 'Qualquer@123',
        },
      });

      expect([401, 404, 429]).toContain(response.status());
    });

    test('deve rejeitar login sem campos obrigatórios', async ({ request }) => {
      const response = await request.post('auth/login', {
        data: {},
      });

      expect([400, 429]).toContain(response.status());
    });
  });
});
