import { test, expect } from '@playwright/test';
import { login, getAuthHeaders } from '../src/helpers/auth.helper';

test.describe('Users API', () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    accessToken = await login(request);
  });

  test.describe('GET /users/profile', () => {
    test('deve retornar o perfil do usuário autenticado', async ({ request }) => {
      const response = await request.get('users/profile', {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('email');
      expect(body.data).toHaveProperty('role');
    });

    test('deve rejeitar requisição sem token', async ({ request }) => {
      const response = await request.get('users/profile');

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar requisição com token inválido', async ({ request }) => {
      const response = await request.get('users/profile', {
        headers: getAuthHeaders('token-invalido-123'),
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.status).toBe('error');
    });
  });

  test.describe('PUT /users/profile', () => {
    test('deve atualizar o nome do perfil', async ({ request }) => {
      const newName = `Teste Atualizado ${Date.now()}`;
      const response = await request.put('users/profile', {
        headers: getAuthHeaders(accessToken),
        data: { name: newName },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.name).toBe(newName);
    });

    test('deve rejeitar atualização sem autenticação', async ({ request }) => {
      const response = await request.put('users/profile', {
        data: { name: 'Sem Token' },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('PUT /users/profile/preferences', () => {
    test('deve atualizar preferências do usuário', async ({ request }) => {
      const response = await request.put('users/profile/preferences', {
        headers: getAuthHeaders(accessToken),
        data: {
          theme: 'dark',
          language: 'pt-BR',
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
    });
  });

  test.describe('PUT /users/profile/avatar', () => {
    test('deve atualizar o avatar do usuário', async ({ request }) => {
      const response = await request.put('users/profile/avatar', {
        headers: getAuthHeaders(accessToken),
        data: {
          avatar: 'https://example.com/avatar-test.png',
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
    });
  });

  test.describe('GET /users/profile/statistics', () => {
    test('deve retornar estatísticas do usuário', async ({ request }) => {
      const response = await request.get('users/profile/statistics', {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toBeDefined();
    });
  });

  test.describe('GET /users', () => {
    test('deve listar usuários com paginação', async ({ request }) => {
      const response = await request.get('users', {
        headers: getAuthHeaders(accessToken),
        params: { page: 1, limit: 5 },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.users).toBeInstanceOf(Array);
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('page');
      expect(body.data).toHaveProperty('limit');
      expect(body.data).toHaveProperty('pages');
    });

    test('deve filtrar usuários por busca', async ({ request }) => {
      const response = await request.get('users', {
        headers: getAuthHeaders(accessToken),
        params: { search: 'test' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.users).toBeInstanceOf(Array);
    });

    test('deve filtrar usuários ativos', async ({ request }) => {
      const response = await request.get('users', {
        headers: getAuthHeaders(accessToken),
        params: { isActive: true },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.users).toBeInstanceOf(Array);
      expect(body.data.users.length).toBeGreaterThan(0);
    });
  });

  test.describe('GET /users/:id', () => {
    test('deve retornar um usuário pelo ID', async ({ request }) => {
      const profileRes = await request.get('users/profile', {
        headers: getAuthHeaders(accessToken),
      });
      const profileBody = await profileRes.json();
      const userId = profileBody.data.id;

      const response = await request.get(`users/${userId}`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(userId);
    });

    test('deve retornar 404 para ID inexistente', async ({ request }) => {
      const response = await request.get('users/000000000000000000000000', {
        headers: getAuthHeaders(accessToken),
      });

      expect([404, 400]).toContain(response.status());
    });
  });
});
