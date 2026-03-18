import crypto from 'crypto';

export function generateUniqueEmail(): string {
  const id = crypto.randomBytes(4).toString('hex');
  return `test_${id}@weid-test.com`;
}

export function generateRandomString(length: number = 8): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export function generateTaskData(overrides: Record<string, unknown> = {}) {
  return {
    title: `Task Test ${generateRandomString(6)}`,
    description: `Descrição da tarefa de teste criada em ${new Date().toISOString()}`,
    status: 'todo' as const,
    priority: 'medium' as const,
    tags: ['test', 'automated'],
    ...overrides,
  };
}

export function generateNoteData(overrides: Record<string, unknown> = {}) {
  return {
    title: `Note Test ${generateRandomString(6)}`,
    content: `Conteúdo da nota de teste criada em ${new Date().toISOString()}`,
    category: 'general' as const,
    isPinned: false,
    tags: ['test', 'automated'],
    ...overrides,
  };
}
