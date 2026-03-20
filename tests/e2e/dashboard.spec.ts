import { test, expect } from '../../src/e2e/fixtures/e2e.fixture';

test.describe('Dashboard', () => {
  test('deve exibir saudação com nome do usuário', async ({ authenticatedPage }) => {
    await authenticatedPage.expectToBeVisible();
    await expect(authenticatedPage.greeting).toContainText(/Bom dia|Boa tarde|Boa noite/);
  });

  test('deve exibir os cards de estatísticas', async ({ authenticatedPage }) => {
    await authenticatedPage.expectStatsCardsVisible();
  });

  test('deve exibir o menu lateral com todas as opções', async ({ authenticatedPage }) => {
    await authenticatedPage.expectSidebarVisible();
  });

  test('deve exibir a seção de tarefas recentes', async ({ authenticatedPage }) => {
    await authenticatedPage.expectRecentTasksVisible();
  });

  test('deve navegar para tarefas ao clicar em "Ver todas"', async ({ authenticatedPage, page }) => {
    await authenticatedPage.viewAllLink.click();
    await expect(page).toHaveURL(/\/tasks/);
  });

  test('deve fazer logout corretamente', async ({ authenticatedPage, page }) => {
    await authenticatedPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });
});
