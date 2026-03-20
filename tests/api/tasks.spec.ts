import { test, expect } from '@playwright/test';
import { login, getAuthHeaders } from '../../src/helpers/auth.helper';
import { generateTaskData } from '../../src/helpers/data.helper';

test.describe('Tasks API', () => {
  let accessToken: string;
  let createdTaskId: string;

  test.beforeAll(async ({ request }) => {
    accessToken = await login(request);
  });

  test.describe('POST /tasks', () => {
    test('deve criar uma tarefa com dados mínimos (apenas título)', async ({ request }) => {
      const response = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: { title: 'Tarefa Mínima Playwright' },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('id');
      expect(body.data.title).toBe('Tarefa Mínima Playwright');
      expect(body.data.status).toBe('todo');
      expect(body.data.priority).toBeDefined();
    });

    test('deve criar uma tarefa com todos os campos', async ({ request }) => {
      const taskData = generateTaskData({
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 8,
        priority: 'high',
      });

      const response = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: taskData,
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.title).toBe(taskData.title);
      expect(body.data.description).toBe(taskData.description);
      expect(body.data.priority).toBe('high');
      expect(body.data.tags).toEqual(expect.arrayContaining(['test', 'automated']));
      createdTaskId = body.data.id;
    });

    test('deve rejeitar tarefa sem título', async ({ request }) => {
      const response = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: { description: 'Sem título' },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar tarefa com status inválido', async ({ request }) => {
      const response = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Tarefa Status Inválido',
          status: 'invalid_status',
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar tarefa com prioridade inválida', async ({ request }) => {
      const response = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Tarefa Priority Inválida',
          priority: 'super_urgent',
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.status).toBe('error');
    });

    test('deve rejeitar criação sem autenticação', async ({ request }) => {
      const response = await request.post('tasks', {
        data: { title: 'Sem Token' },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('GET /tasks', () => {
    test('deve listar tarefas com paginação', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { page: 1, limit: 5 },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.tasks).toBeInstanceOf(Array);
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('page');
      expect(body.data.page).toBe(1);
      expect(body.data.limit).toBe(5);
    });

    test('deve filtrar tarefas por status', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { status: 'todo' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.tasks).toBeInstanceOf(Array);
      for (const task of body.data.tasks) {
        expect(task.status).toBe('todo');
      }
    });

    test('deve filtrar tarefas por prioridade', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { priority: 'high' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.tasks).toBeInstanceOf(Array);
      for (const task of body.data.tasks) {
        expect(task.priority).toBe('high');
      }
    });

    test('deve buscar tarefas por termo de pesquisa', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { search: 'Playwright' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.tasks).toBeInstanceOf(Array);
    });

    test('deve filtrar tarefas não arquivadas', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { isArchived: false },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.tasks).toBeInstanceOf(Array);
    });

    test('deve ordenar tarefas', async ({ request }) => {
      const response = await request.get('tasks', {
        headers: getAuthHeaders(accessToken),
        params: { sortBy: 'createdAt', sortOrder: 'desc' },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.tasks).toBeInstanceOf(Array);
    });
  });

  test.describe('GET /tasks/:id', () => {
    test('deve retornar uma tarefa pelo ID', async ({ request }) => {
      test.skip(!createdTaskId, 'Nenhuma tarefa foi criada anteriormente');

      const response = await request.get(`tasks/${createdTaskId}`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(createdTaskId);
      expect(body.data).toHaveProperty('title');
      expect(body.data).toHaveProperty('status');
      expect(body.data).toHaveProperty('priority');
      expect(body.data).toHaveProperty('owner');
      expect(body.data).toHaveProperty('createdAt');
    });

    test('deve retornar 404 para tarefa inexistente', async ({ request }) => {
      const response = await request.get('tasks/000000000000000000000000', {
        headers: getAuthHeaders(accessToken),
      });

      expect([404, 400]).toContain(response.status());
    });
  });

  test.describe('PUT /tasks/:id', () => {
    test('deve atualizar uma tarefa', async ({ request }) => {
      test.skip(!createdTaskId, 'Nenhuma tarefa foi criada anteriormente');

      const response = await request.put(`tasks/${createdTaskId}`, {
        headers: getAuthHeaders(accessToken),
        data: {
          title: 'Tarefa Atualizada Playwright',
          status: 'inProgress',
          priority: 'urgent',
          progress: 25,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data.title).toBe('Tarefa Atualizada Playwright');
      expect(body.data.status).toBe('inProgress');
      expect(body.data.priority).toBe('urgent');
    });

    test('deve rejeitar atualização com dados inválidos', async ({ request }) => {
      test.skip(!createdTaskId, 'Nenhuma tarefa foi criada anteriormente');

      const response = await request.put(`tasks/${createdTaskId}`, {
        headers: getAuthHeaders(accessToken),
        data: {
          status: 'status_invalido',
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /tasks/statistics', () => {
    test('deve retornar estatísticas das tarefas', async ({ request }) => {
      const response = await request.get('tasks/statistics', {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('byStatus');
      expect(body.data.byStatus).toHaveProperty('todo');
      expect(body.data.byStatus).toHaveProperty('inProgress');
      expect(body.data.byStatus).toHaveProperty('inReview');
      expect(body.data.byStatus).toHaveProperty('done');
      expect(body.data).toHaveProperty('byPriority');
      expect(body.data.byPriority).toHaveProperty('low');
      expect(body.data.byPriority).toHaveProperty('medium');
      expect(body.data.byPriority).toHaveProperty('high');
      expect(body.data.byPriority).toHaveProperty('urgent');
      expect(body.data).toHaveProperty('completed');
      expect(body.data).toHaveProperty('overdue');
    });
  });

  test.describe('PATCH /tasks/:id/archive & restore', () => {
    test('deve arquivar uma tarefa', async ({ request }) => {
      test.skip(!createdTaskId, 'Nenhuma tarefa foi criada anteriormente');

      const response = await request.patch(`tasks/${createdTaskId}/archive`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
    });

    test('deve restaurar uma tarefa arquivada', async ({ request }) => {
      test.skip(!createdTaskId, 'Nenhuma tarefa foi criada anteriormente');

      const response = await request.patch(`tasks/${createdTaskId}/restore`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
    });
  });

  test.describe('DELETE /tasks/:id', () => {
    test('deve excluir uma tarefa', async ({ request }) => {
      const createRes = await request.post('tasks', {
        headers: getAuthHeaders(accessToken),
        data: { title: 'Tarefa para Deletar' },
      });
      const createBody = await createRes.json();
      const taskToDelete = createBody.data.id;

      const response = await request.delete(`tasks/${taskToDelete}`, {
        headers: getAuthHeaders(accessToken),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');

      const getRes = await request.get(`tasks/${taskToDelete}`, {
        headers: getAuthHeaders(accessToken),
      });
      expect(getRes.status()).toBe(404);
    });

    test('deve retornar 404 ao deletar tarefa inexistente', async ({ request }) => {
      const response = await request.delete('tasks/000000000000000000000000', {
        headers: getAuthHeaders(accessToken),
      });

      expect([404, 400]).toContain(response.status());
    });
  });
});
