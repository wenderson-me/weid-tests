import { test, expect } from '@playwright/test';
import { login, getAuthHeaders } from '../src/helpers/auth.helper';
import { generateNoteData } from '../src/helpers/data.helper';

test.describe('Notes API', () => {
  let accessToken: string;
  let createdNoteId: string;

  test.beforeAll(async ({ request }) => {
    accessToken = await login(request);
  });

  test.describe('POST /notes', () => {
    test('deve criar uma nota com dados completos', async ({ request }) => {
      const noteData = generateNoteData({
        category: 'work',
        color: '#3498db',
        isPinned: true,
      });

      const response = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: noteData,
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('id');
      expect(body.data.title).toBe(noteData.title);
      expect(body.data.content).toBe(noteData.content);
      expect(body.data.category).toBe('work');
      expect(body.data.isPinned).toBe(true);
      expect(body.data.tags).toEqual(expect.arrayContaining(['test', 'automated']));
      createdNoteId = body.data.id;
    });

    test('deve criar uma nota com dados mínimos', async ({ request }) => {
      const response = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Nota Mínima Playwright',
          content: 'Conteúdo mínimo',
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.category).toBe('general');
      expect(body.data.isPinned).toBe(false);
    });

    test('deve rejeitar nota sem título', async ({ request }) => {
      const response = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: { content: 'Sem título' },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar nota sem conteúdo', async ({ request }) => {
      const response = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: { title: 'Sem conteúdo' },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar nota com categoria inválida', async ({ request }) => {
      const response = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Nota Categoria Inválida',
          content: 'Conteúdo teste',
          category: 'invalid_category',
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar criação sem autenticação', async ({ request }) => {
      const response = await request.post('notes', {
        data: { title: 'Sem Token', content: 'teste' },
      });

      expect(response.status()).toBe(401);
    });

    test('deve criar notas com todas as categorias válidas', async ({ request }) => {
      const categories = ['general', 'personal', 'work', 'important', 'idea'] as const;

      for (const category of categories) {
        const response = await request.post('notes', {
          headers: getAuthHeaders(accessToken),
          data: generateNoteData({ category }),
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.data.category).toBe(category);
      }
    });
  });

  test.describe('GET /notes', () => {
    test('deve listar notas com paginação', async ({ request }) => {
      const response = await request.get('notes', {
        headers: getAuthHeaders(accessToken),
        params: { page: 1, limit: 5 },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.notes).toBeInstanceOf(Array);
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('page');
      expect(body.data).toHaveProperty('limit');
    });

    test('deve filtrar notas por categoria', async ({ request }) => {
      const response = await request.get('notes', {
        headers: getAuthHeaders(accessToken),
        params: { category: 'work' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.notes).toBeInstanceOf(Array);
      for (const note of body.data.notes) {
        expect(note.category).toBe('work');
      }
    });

    test('deve filtrar notas fixadas', async ({ request }) => {
      const response = await request.get('notes', {
        headers: getAuthHeaders(accessToken),
        params: { isPinned: true },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.notes).toBeInstanceOf(Array);
      for (const note of body.data.notes) {
        expect(note.isPinned).toBe(true);
      }
    });

    test('deve buscar notas por termo de pesquisa', async ({ request }) => {
      const response = await request.get('notes', {
        headers: getAuthHeaders(accessToken),
        params: { search: 'Playwright' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.notes).toBeInstanceOf(Array);
    });
  });

  test.describe('GET /notes/:id', () => {
    test('deve retornar uma nota pelo ID', async ({ request }) => {
      test.skip(!createdNoteId, 'Nenhuma nota foi criada anteriormente');

      const response = await request.get(`notes/${createdNoteId}`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(createdNoteId);
      expect(body.data).toHaveProperty('title');
      expect(body.data).toHaveProperty('content');
      expect(body.data).toHaveProperty('category');
      expect(body.data).toHaveProperty('owner');
      expect(body.data).toHaveProperty('createdAt');
    });

    test('deve retornar 404 para nota inexistente', async ({ request }) => {
      const response = await request.get('notes/000000000000000000000000', {
        headers: getAuthHeaders(accessToken),
      });

      expect([404, 400]).toContain(response.status());
    });
  });

  test.describe('PUT /notes/:id', () => {
    test('deve atualizar uma nota', async ({ request }) => {
      test.skip(!createdNoteId, 'Nenhuma nota foi criada anteriormente');

      const response = await request.put(`notes/${createdNoteId}`, {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Nota Atualizada Playwright',
          content: 'Conteúdo atualizado pelo teste',
          category: 'important',
          color: '#e74c3c',
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.title).toBe('Nota Atualizada Playwright');
      expect(body.data.content).toBe('Conteúdo atualizado pelo teste');
      expect(body.data.category).toBe('important');
    });

    test('deve rejeitar atualização com categoria inválida', async ({ request }) => {
      test.skip(!createdNoteId, 'Nenhuma nota foi criada anteriormente');

      const response = await request.put(`notes/${createdNoteId}`, {
        headers: getAuthHeaders(accessToken),
        data: { category: 'invalid' },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('PATCH /notes/:id/pin & unpin', () => {
    test('deve fixar uma nota', async ({ request }) => {
      test.skip(!createdNoteId, 'Nenhuma nota foi criada anteriormente');

      const response = await request.patch(`notes/${createdNoteId}/pin`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.isPinned).toBe(true);
    });

    test('deve desfixar uma nota', async ({ request }) => {
      test.skip(!createdNoteId, 'Nenhuma nota foi criada anteriormente');

      const response = await request.patch(`notes/${createdNoteId}/unpin`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.isPinned).toBe(false);
    });
  });

  test.describe('GET /notes/statistics', () => {
    test('deve retornar estatísticas das notas', async ({ request }) => {
      const response = await request.get('notes/statistics', {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('byCategory');
      expect(body.data.byCategory).toHaveProperty('general');
      expect(body.data.byCategory).toHaveProperty('personal');
      expect(body.data.byCategory).toHaveProperty('work');
      expect(body.data.byCategory).toHaveProperty('important');
      expect(body.data.byCategory).toHaveProperty('idea');
      expect(body.data).toHaveProperty('pinned');
    });
  });

  test.describe('DELETE /notes/:id', () => {
    test('deve excluir uma nota', async ({ request }) => {
      const createRes = await request.post('notes', {
        headers: getAuthHeaders(accessToken),
        data: { title: 'Nota para Deletar', content: 'Será deletada' },
      });
      const createBody = await createRes.json();
      const noteToDelete = createBody.data.id;

      const response = await request.delete(`notes/${noteToDelete}`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');

      const getRes = await request.get(`notes/${noteToDelete}`, {
        headers: getAuthHeaders(accessToken),
      });
      expect(getRes.status()).toBe(404);
    });

    test('deve retornar 404 ao deletar nota inexistente', async ({ request }) => {
      const response = await request.delete('notes/000000000000000000000000', {
        headers: getAuthHeaders(accessToken),
      });

      expect([404, 400]).toContain(response.status());
    });
  });
});
